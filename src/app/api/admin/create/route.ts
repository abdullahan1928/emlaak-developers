import dbConnect from "@/lib/connectDB";
import Admin from "@/models/admin.model";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      return new Response(
        JSON.stringify({ message: "Admin already exists" }),
        { status: 409 }
      );
    }

    // Create admin
    const newAdmin = await Admin.create({
      email: normalizedEmail,
      password: password,
      role: role || "admin",
    });

    return new Response(
      JSON.stringify({
        message: "Admin created successfully",
        admin: {
          id: newAdmin._id,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Create admin error:", error);

    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}