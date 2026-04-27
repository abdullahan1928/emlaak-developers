import dbConnect from "@/lib/connectDB";
import Blog from "@/models/blog.model";
import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const blog = await Blog.findById(id).lean();

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let newPublicId = "";

  try {
    await dbConnect();
    const { id } = await params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const body = await req.json();
    const { coverImageBase64, removeCoverImage, ...rest } = body;

    // Remove existing cover image
    if (removeCoverImage && blog.coverImagePublicId) {
      await cloudinary.uploader.destroy(blog.coverImagePublicId);
      rest.coverImage = "";
      rest.coverImagePublicId = "";
    }

    // Upload new cover image
    if (coverImageBase64) {
      // Delete old one first
      if (blog.coverImagePublicId) {
        await cloudinary.uploader.destroy(blog.coverImagePublicId);
      }
      const res = await cloudinary.uploader.upload(coverImageBase64, {
        folder: "blogs",
      });
      rest.coverImage = res.secure_url;
      rest.coverImagePublicId = res.public_id;
      newPublicId = res.public_id;
    }

    const updated = await Blog.findByIdAndUpdate(id, rest, { new: true });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (newPublicId) await cloudinary.uploader.destroy(newPublicId);
    console.error("PUT Blog Error:", error);
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
  try {
    await dbConnect();
    const { id } = await params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // Delete cover image from Cloudinary
    if (blog.coverImagePublicId) {
      await cloudinary.uploader.destroy(blog.coverImagePublicId);
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Blog Error:", error);
    return NextResponse.json(
      { message: "Delete failed", error: error.message },
      { status: 500 }
    );
  }
}