import dbConnect from "@/lib/connectDB";
import Project from "@/models/project.model";
import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/s3";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    await dbConnect();

    const { title, location, price, category, views, description, tags, pictures } = await req.json();

    // Decode base64 images
    const decodeBase64Image = (data: string) => {
        const matches = data.match(/^data:(.+);base64,(.+)$/);
        if (matches?.length !== 3) {
            throw new Error('Invalid input string');
        }
        return Buffer.from(matches[2], 'base64');
    };

    const projectId = new mongoose.Types.ObjectId();

    try {
        // Upload base64 images to S3
        const pictureUrls = await Promise.all(
            (pictures as string[]).map(async (picture: string, index: number) => {
                const fileContent = decodeBase64Image(picture);
                const location = await uploadFile(fileContent, projectId.toString(), index);
                return location.Location; // Assuming `location.Location` contains the URL of the uploaded file
            })
        );

        // Save project data to MongoDB
        const project = new Project({
            _id: projectId,
            title,
            location,
            price,
            category,
            views,
            description,
            tags,
            pictures: pictureUrls,
        });

        await project.save();

        return new NextResponse(JSON.stringify({ message: "Project added" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error saving project", error);
        return new NextResponse(
            JSON.stringify({ message: "Internal server error" }),
            { status: 500 }
        );
    }
}

// get all projects
export async function GET() {
    await dbConnect();

    const projects = await Project.find({});

    return new NextResponse(JSON.stringify(projects), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}