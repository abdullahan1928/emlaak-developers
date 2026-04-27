import dbConnect from "@/lib/connectDB";
import Blog from "@/models/blog.model";
import cloudinary from "@/lib/cloudinary";
import { BlogStatus } from "@/enums/blog.enum";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const publishedParam = searchParams.get("published") || "true";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "asc" ? 1 : -1;

    const query: Record<string, any> = {};

    if (publishedParam !== "all") {
      query.status = publishedParam === "true"
        ? BlogStatus.PUBLISHED
        : BlogStatus.DRAFT;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "all") query.category = category;

    const total = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .select("-content") // exclude heavy HTML from list view
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ blogs, total });
  } catch (error: any) {
    console.error("GET Blogs Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch blogs", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  let uploadedPublicId = "";

  try {
    await dbConnect();

    const body = await req.json();
    const { coverImageBase64, ...rest } = body;

    // Upload cover image if provided
    if (coverImageBase64) {
      const res = await cloudinary.uploader.upload(coverImageBase64, {
        folder: "blogs",
      });
      rest.coverImage = res.secure_url;
      rest.coverImagePublicId = res.public_id;
      uploadedPublicId = res.public_id;
    }

    const blog = await Blog.create(rest);

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error: any) {
    // Roll back uploaded image on failure
    if (uploadedPublicId) {
      await cloudinary.uploader.destroy(uploadedPublicId);
    }
    console.error("POST Blog Error:", error);
    return NextResponse.json(
      { message: "Failed to create blog", error: error.message },
      { status: 500 }
    );
  }
}