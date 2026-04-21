import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/project.model";
import Property from "@/models/property.model";
import dbConnect from "@/lib/connectDB";
import { PublishStatus } from "@/enums/project.enum";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    // Each word becomes a separate $regex condition joined with $or
    const words = query.split(/\s+/).filter(Boolean);
    const regexConditions = (fields: string[]) =>
      words.flatMap((word) =>
        fields.map((field) => ({
          [field]: { $regex: word, $options: "i" },
        }))
      );

    const [projects, properties] = await Promise.all([
      Project.find({
        $or: regexConditions(["title", "location", "tags"]),
        status: PublishStatus.PUBLISHED,
      })
        .limit(5)
        .lean(),

      Property.find({
        $or: regexConditions(["title", "location", "city"]),
      })
        .limit(5)
        .lean(),
    ]);

    const formattedProjects = projects.map((p) => ({
      id: p._id,
      title: p.title,
      slug: p.slug,
      location: p.location,
      image: p.images?.[0]?.url ?? null,
      type: "project",
    }));

    const formattedProperties = properties.map((p: any) => ({
      id: p._id,
      title: p.title,
      slug: p.slug,
      location: p.location,
      image: p.images?.[0]?.url ?? null,
      type: "property",
      price: p.price,
    }));

    return NextResponse.json({
      results: [...formattedProjects, ...formattedProperties],
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}