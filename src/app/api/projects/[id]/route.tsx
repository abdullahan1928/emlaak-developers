import { PublishStatus } from "@/enums/project.enum";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/connectDB";
import Project from "@/models/project.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        const { id } = await params;

        // ✅ Only published
        const project = await Project.findOne({
            _id: id,
            // status: PublishStatus.PUBLISHED,
        }).lean();

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        return new NextResponse(
            JSON.stringify(project),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
    } catch (error: any) {
        console.error("GET Project By ID Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch project",
                error: error.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();

    const { id } = await params;

    const data = await req.json();
    const {
        title,
        slug,
        location,
        mapUrl,
        startingPrice,
        category,
        description,
        tags,
        status,
        existingImages = [],
        newImages = [],
        removedImages = [],
    } = data;

    const uploaded: any[] = [];

    try {
        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        // DELETE
        if (removedImages.length) {
            await Promise.all(
                removedImages.map((id: string) =>
                    cloudinary.uploader.destroy(id)
                )
            );
        }

        // UPLOAD NEW
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

        // KEEP EXISTING + ORDER
        const updatedImages = [
            ...existingImages.map((img: any) => {
                const existing = project.images.find(
                    (i: any) => i.public_id === img.public_id
                );
                if (!existing) {
                    return img;
                }
                return { ...existing, order: img.order };
            }),
            ...uploaded,
        ];

        const updated = await Project.findByIdAndUpdate(
            id,
            {
                title,
                slug,
                location,
                mapUrl,
                startingPrice,
                category,
                description,
                tags,
                status,
                images: updatedImages,
            },
            { new: true }
        );

        return NextResponse.json(updated);

    } catch (err) {
        console.error(err);

        // rollback uploads
        await Promise.all(
            uploaded.map((img) =>
                cloudinary.uploader.destroy(img.public_id)
            )
        );

        return NextResponse.json(
            { message: "Update failed" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();

    const { id } = await params;

    try {
        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        // 🔥 Delete all images from Cloudinary
        await Promise.all(
            project.images.map((img: any) =>
                cloudinary.uploader.destroy(img.public_id)
            )
        );

        // 🔥 Delete project
        await Project.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Project deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting project", error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}