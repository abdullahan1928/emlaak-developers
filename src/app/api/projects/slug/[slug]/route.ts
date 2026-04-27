import { PublishStatus } from "@/enums/project.enum";
import dbConnect from "@/lib/connectDB";
import Project from "@/models/project.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      );
    }

    const project = await Project.findOne({
      slug,
      status: PublishStatus.PUBLISHED,
    }).lean();

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