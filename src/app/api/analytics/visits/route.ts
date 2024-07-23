import dbConnect from "@/lib/connectDB";
import Visit from "@/models/visit.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { path, ip, userAgent } = await req.json();

  const visit = new Visit({ path, ip, userAgent });

  try {
    await visit.save();
    return new NextResponse(JSON.stringify({ message: "Visit recorded" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  const visits = await Visit.find().sort({ timestamp: -1 });

  try {
    return new NextResponse(JSON.stringify(visits), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
