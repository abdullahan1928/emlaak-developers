import dbConnect from "@/lib/connectDB";
import Property from "@/models/property.model";
import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const purpose = searchParams.get("purpose") || "";
        const type = searchParams.get("type") || "";
        const city = searchParams.get("city") || "";
        const minPrice = searchParams.get("minPrice") || "";
        const maxPrice = searchParams.get("maxPrice") || "";
        const bedrooms = searchParams.get("bedrooms") || "";
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const order = searchParams.get("order") === "asc" ? 1 : -1;
        // Admin can pass published=all to see unpublished too
        const publishedParam = searchParams.get("published") || "true";

        const query: Record<string, any> = {};

        if (publishedParam !== "all") {
            query.isPublished = publishedParam === "true";
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { city: { $regex: search, $options: "i" } },
                { area: { $regex: search, $options: "i" } },
            ];
        }

        if (purpose) query.purpose = purpose;
        if (type) query.type = type;
        if (city) query.city = { $regex: city, $options: "i" };
        if (bedrooms) query.bedrooms = parseInt(bedrooms);

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice);
            if (maxPrice) query.price.$lte = parseInt(maxPrice);
        }

        const total = await Property.countDocuments(query);

        const properties = await Property.find(query)
            .sort({ [sortBy]: order })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({ properties, total });
    } catch (error: any) {
        console.error("GET Properties Error:", error);
        return NextResponse.json(
            { message: "Failed to fetch properties", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const uploadedImages: { url: string; order: number; public_id: string }[] = [];

    try {
        await dbConnect();

        const body = await req.json();
        const { images, ...rest } = body;

        // Upload each base64 image to Cloudinary on the server
        for (let i = 0; i < images.length; i++) {
            const res = await cloudinary.uploader.upload(images[i], {
                folder: "properties",
            });
            uploadedImages.push({
                url: res.secure_url,
                order: i,
                public_id: res.public_id,
            });
        }

        const property = await Property.create({
            ...rest,
            images: uploadedImages,
        });

        return NextResponse.json({ property }, { status: 201 });
    } catch (error: any) {
        // Roll back any images that were uploaded before the failure
        await Promise.all(
            uploadedImages.map((img) =>
                cloudinary.uploader.destroy(img.public_id)
            )
        );

        console.error("POST Property Error:", error);
        return NextResponse.json(
            { message: "Failed to create property", error: error.message },
            { status: 500 }
        );
    }
}