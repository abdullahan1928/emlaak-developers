import dbConnect from "@/lib/connectDB";
import { deleteObjectFromS3, getKeyFromUrl, uploadFile } from "@/lib/s3";
import Project from "@/models/project.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    const id = params.id;

    const project = await Project.findById(id);

    if (!project) {
        return new NextResponse(
            JSON.stringify({ message: "Project not found" }),
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
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    const { title, location, price, category, views, description, tags, pictures, removePictures } = await req.json();

    // Decode base64 images
    const decodeBase64Image = (data: string) => {
        const matches = data.match(/^data:(.+);base64,(.+)$/);
        if (matches?.length !== 3) {
            throw new Error('Invalid input string');
        }
        return Buffer.from(matches[2], 'base64');
    };

    try {
        // Find the existing project
        const project = await Project.findById(params.id);
        if (!project) {
            return new NextResponse(
                JSON.stringify({ message: "Project not found" }),
                { status: 404 }
            );
        }

        // Process new images
        const newPictureUrls = await Promise.all(
            (pictures as string[]).map(async (picture: string, index: number) => {
                const fileContent = decodeBase64Image(picture);
                const fileName = `${params.id}-${index}.jpg`; // Ensure unique file names
                const location = await uploadFile(fileContent, fileName, index)
                return location.Location;
            })
        );

        // Update project data
        const updatedProjectData: any = {
            title,
            location,
            price,
            category,
            views,
            description,
            tags,
            pictures: [...project.pictures, ...newPictureUrls],
        };

        // Handle removed pictures
        if (removePictures && Array.isArray(removePictures)) {
            // Delete removed pictures from S3
            const deletePromises = removePictures.map(async (url: string) => {
                const key = getKeyFromUrl(url);
                await deleteObjectFromS3(key);
            });

            await Promise.all(deletePromises);

            // Filter out removed pictures from the database
            updatedProjectData.pictures = project.pictures.filter(
                (pic: string) => !removePictures.includes(pic)
            );
        }

        // Update the project in MongoDB
        await Project.findByIdAndUpdate(params.id, updatedProjectData, { new: true });

        return new NextResponse(
            JSON.stringify({ message: "Project updated successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating project", error);
        return new NextResponse(
            JSON.stringify({ message: "Internal server error" }),
            { status: 500 }
        );
    }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    const id = params.id;

    // Retrieve the project to get its pictures
    const project = await Project.findById(id);

    if (!project) {
        return new NextResponse(
            JSON.stringify({ message: "Project not found" }),
            { status: 404 }
        );
    }

    // Delete the pictures from S3
    const deletePromises = project.pictures.map(async (url: string) => {
        const key = getKeyFromUrl(url);
        console.log(key);
        await deleteObjectFromS3(key);
    });

    try {
        // Wait for all pictures to be deleted
        await Promise.all(deletePromises);

        // Delete the project from MongoDB
        await Project.findByIdAndDelete(id);

        return new NextResponse(JSON.stringify({ message: "Project deleted" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error deleting project", error);
        return new NextResponse(
            JSON.stringify({ message: "Internal server error" }),
            { status: 500 }
        );
    }
}