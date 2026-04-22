import dbConnect from "@/lib/connectDB";
import Property from "@/models/property.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;
    console.log("slug",slug)

    if (!slug) {
      return NextResponse.json({ message: "Slug is required" }, { status: 400 });
    }

    console.log("after slug")


    const property = await Property.findOne({
      slug,
      isPublished: true,
    }).lean();

    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error: any) {
    console.error("GET Property by Slug Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch property", error: error.message },
      { status: 500 }
    );
  }
}