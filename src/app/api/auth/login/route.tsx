import dbConnect from "@/lib/connectDB";
import Admin from "@/models/admin.model";
import { signToken } from "@/utils/jwt";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
        return new Response(
            JSON.stringify({ message: "Email and password are required" }),
            { status: 400 }
        );
    }

    try {
        // Find by email only — never query by plain-text password
        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

        console.log(admin)

        if (!admin) {
            return new Response(
                JSON.stringify({ message: "Invalid credentials" }),
                { status: 401 }
            );
        }

        const isMatch = await admin.comparePassword(password);

        console.log(password)
        console.log(isMatch)

        if (!isMatch) {
            return new Response(
                JSON.stringify({ message: "Invalid credentials" }),
                { status: 401 }
            );
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        const token = signToken({ id: admin._id, email: admin.email, role: admin.role });
        const maxAge = 60 * 60 * 24 * 30; // 30 days in seconds

        const cookie = [
            `token=${token}`,
            `Path=/`,
            `HttpOnly`,
            `SameSite=Strict`,
            `Max-Age=${maxAge}`,
            process.env.NODE_ENV === "production" ? "Secure" : "",
        ]
            .filter(Boolean)
            .join("; ");

        return new Response(
            JSON.stringify({ message: "Logged in successfully" }),
            {
                status: 200,
                headers: {
                    "Set-Cookie": cookie,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("Login error:", error);
        return new Response(
            JSON.stringify({ message: "Internal server error" }),
            { status: 500 }
        );
    }
}