import { PublishStatus } from "@/enums/project.enum";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/connectDB";
import Project from "@/models/project.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const project = await Project.findById(id).lean();

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(project);
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch project", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    const data = await req.json();
    const {
        existingImages = [],
        newImages = [],      // base64 strings
        removedImages = [],  // public_ids to delete
        ...rest
    } = data;

    const uploaded: { url: string; public_id: string; order: number }[] = [];

    try {
        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Delete removed images from Cloudinary
        if (removedImages.length) {
            await Promise.all(
                removedImages.map((pid: string) => cloudinary.uploader.destroy(pid))
            );
        }

        // Upload new base64 images
        for (let i = 0; i < newImages.length; i++) {
            const res = await cloudinary.uploader.upload(newImages[i], {
                folder: "projects",
            });
            uploaded.push({
                url: res.secure_url,
                public_id: res.public_id,
                order: existingImages.length + i,
            });
        }

        // Merge existing (reordered) + newly uploaded
        const updatedImages = [
            ...existingImages.map((img: any) => {
                const existing = project.images.find(
                    (i: any) => i.public_id === img.public_id
                );
                return existing
                    ? { ...existing, order: img.order }
                    : img;
            }),
            ...uploaded,
        ];

        const updated = await Project.findByIdAndUpdate(
            id,
            {
                ...rest,
                startingPrice: Number(rest.startingPrice),
                maxPrice: rest.maxPrice ? Number(rest.maxPrice) : null,
                images: updatedImages,
            },
            { new: true }
        );

        return NextResponse.json(updated);
    } catch (error: any) {
        // Roll back newly uploaded images on failure
        await Promise.all(
            uploaded.map((img) => cloudinary.uploader.destroy(img.public_id))
        );
        console.error("PUT Project Error:", error);
        return NextResponse.json(
            { message: "Update failed", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    try {
        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Delete all images from Cloudinary
        await Promise.all(
            project.images.map((img: any) =>
                img.public_id
                    ? cloudinary.uploader.destroy(img.public_id)
                    : Promise.resolve()
            )
        );

        await Project.findByIdAndDelete(id);

        return NextResponse.json({ message: "Project deleted successfully" });
    } catch (error: any) {
        console.error("DELETE Project Error:", error);
        return NextResponse.json(
            { message: "Delete failed", error: error.message },
            { status: 500 }
        );
    }
}