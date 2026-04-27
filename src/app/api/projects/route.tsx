import dbConnect from "@/lib/connectDB";
import Project from "@/models/project.model";
import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { PublishStatus } from "@/enums/project.enum";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const projectStatus = searchParams.get("projectStatus") || "";
    const city = searchParams.get("city") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "asc" ? 1 : -1;
    const publishedParam = searchParams.get("published") || "true";

    const query: Record<string, any> = {};

    if (publishedParam !== "all") {
      query.status = publishedParam === "true"
        ? PublishStatus.PUBLISHED
        : PublishStatus.DRAFT;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { developerName: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") query.category = category;
    if (projectStatus && projectStatus !== "All") query.projectStatus = projectStatus;
    if (city) query.city = { $regex: city, $options: "i" };

    const total = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ projects, total });
  } catch (error: any) {
    console.error("GET Projects Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch projects", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const uploadedImages: { url: string; order: number; public_id: string }[] = [];

  try {
    await dbConnect();

    const body = await req.json();
    const { images, ...rest } = body;

    // Upload each base64 image to Cloudinary on the server
    for (let i = 0; i < images.length; i++) {
      const res = await cloudinary.uploader.upload(images[i], {
        folder: "projects",
      });
      uploadedImages.push({
        url: res.secure_url,
        order: i,
        public_id: res.public_id,
      });
    }

    const project = await Project.create({
      ...rest,
      startingPrice: Number(rest.startingPrice),
      maxPrice: rest.maxPrice ? Number(rest.maxPrice) : null,
      images: uploadedImages,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    // Roll back any uploaded images on failure
    await Promise.all(
      uploadedImages.map((img) => cloudinary.uploader.destroy(img.public_id))
    );
    console.error("POST Project Error:", error);
    return NextResponse.json(
      { message: "Error creating project: " + error.message },
      { status: 500 }
    );
  }
}