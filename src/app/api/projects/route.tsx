import dbConnect from "@/lib/connectDB";
import Project from "@/models/project.model";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  await dbConnect();

  const uploadedImages: { url: string; order: number; public_id: string }[] = [];

  try {
    const body = await req.json();

    const { images, ...rest } = body;

    // Upload images to Cloudinary
    for (let i = 0; i < images.length; i++) {
      const res = await cloudinary.uploader.upload(images[i], { folder: "projects" });
      uploadedImages.push({ url: res.secure_url, order: i, public_id: res.public_id });
    }

    const project = await Project.create({
      ...rest,
      images: uploadedImages,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    // delete the images from cloudinary if project creation fails
    await Promise.all(
      uploadedImages.map(img => cloudinary.uploader.destroy(img.public_id))
    );

    return NextResponse.json(
      { message: "Error creating project" + error },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "asc" ? 1 : -1;

    const query: any = {};

    // 🔍 SEARCH
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // 🏷 FILTER
    if (category && category !== "All") {
      query.category = category;
    }

    const total = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      projects,
      total,
    });
  } catch (error: any) {
    console.error("GET Projects Error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch projects",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}