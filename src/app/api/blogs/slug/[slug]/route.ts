import dbConnect from "@/lib/connectDB";
import Blog from "@/models/blog.model";
import { BlogStatus } from "@/enums/blog.enum";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ message: "Slug is required" }, { status: 400 });
    }

    // Find and increment view count atomically
    const blog = await Blog.findOneAndUpdate(
      { slug, status: BlogStatus.PUBLISHED },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch blog", error: error.message },
      { status: 500 }
    );
  }
}