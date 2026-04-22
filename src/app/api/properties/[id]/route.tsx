import dbConnect from "@/lib/connectDB";
import Property from "@/models/property.model";
import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const property = await Property.findById(id).lean();

    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch property", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  const data = await req.json();
  const {
    existingImages = [],
    newImages = [],      // base64 strings from the browser
    removedImages = [],  // public_ids to delete from Cloudinary
    ...rest
  } = data;

  const uploaded: { url: string; public_id: string; order: number }[] = [];

  try {
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    // Delete removed images from Cloudinary
    if (removedImages.length) {
      await Promise.all(
        removedImages.map((publicId: string) =>
          cloudinary.uploader.destroy(publicId)
        )
      );
    }

    // Upload new base64 images to Cloudinary
    for (let i = 0; i < newImages.length; i++) {
      const res = await cloudinary.uploader.upload(newImages[i], {
        folder: "properties",
      });
      uploaded.push({
        url: res.secure_url,
        public_id: res.public_id,
        order: existingImages.length + i,
      });
    }

    // Merge existing (reordered) + newly uploaded
    const updatedImages = [
      ...existingImages.map((img: any) => {
        const existing = property.images.find(
          (i: any) => i.public_id === img.public_id
        );
        return existing
          ? { ...(existing as any).toObject(), order: img.order }
          : img;
      }),
      ...uploaded,
    ];

    const updated = await Property.findByIdAndUpdate(
      id,
      { ...rest, images: updatedImages },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    // Roll back newly uploaded images on failure
    await Promise.all(
      uploaded.map((img) => cloudinary.uploader.destroy(img.public_id))
    );

    console.error("PUT Property Error:", error);
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
  await dbConnect();
  const { id } = await params;

  try {
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    // Delete all images from Cloudinary
    await Promise.all(
      property.images.map((img: any) =>
        img.public_id ? cloudinary.uploader.destroy(img.public_id) : Promise.resolve()
      )
    );

    await Property.findByIdAndDelete(id);

    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Property Error:", error);
    return NextResponse.json(
      { message: "Delete failed", error: error.message },
      { status: 500 }
    );
  }
}