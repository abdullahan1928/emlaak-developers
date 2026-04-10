import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/project.model";
import Property from "@/models/property.model";
import dbConnect from "@/lib/connectDB";
import { PublishStatus } from "@/enums/project.enum";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const searchRegex = query.trim().split(/\s+/).join("|");

    // 🔹 Fetch Projects
    const projects = await Project.find({
      title: { $regex: searchRegex, $options: "i" },
      status: PublishStatus.PUBLISHED
    })
      .limit(5)
      .lean();

    // 🔹 Fetch Properties
    const properties = await Property.find({
      $or: [
        { title: searchRegex },
        { location: searchRegex },
        { city: searchRegex },
      ],
    })
      .limit(5)
      .lean();

    // 🔹 Normalize Results
    const formattedProjects = projects.map((p) => ({
      id: p._id,
      title: p.title,
      slug: p.slug,
      location: p.location,
      image: p.images?.[0]?.url || p.images?.[0], // adjust based on schema
      type: "project",
    }));

    const formattedProperties = properties.map((p) => ({
      id: p._id,
      title: p.title,
      slug: p.slug,
      location: p.location,
      image: p.images?.[0]?.url || p.images?.[0],
      type: "property",
      price: p.price,
    }));

    return NextResponse.json({
      results: [...formattedProjects, ...formattedProperties],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}