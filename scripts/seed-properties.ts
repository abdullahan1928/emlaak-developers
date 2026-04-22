import "dotenv/config";
import mongoose from "mongoose";
import csv from "csvtojson";
import Property from "@/models/property.model";
import { slugify } from "@/lib/slugify";

const MONGODB_URI = process.env.MONGODB_URI || "";

async function seedFromCSV() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB");

  const jsonArray = await csv().fromFile("scripts/properties.csv");

  const properties = jsonArray.map((item: any) => ({
    title: item.title,
    slug: slugify(item.title),
    description: item.description,

    type: item.type,
    purpose: item.purpose,
    status: item.status || "AVAILABLE",

    location: item.location,
    city: item.city,
    area: item.area,

    price: Number(item.price),
    isNegotiable: item.isNegotiable === "true",

    areaSize: Number(item.areaSize),
    areaUnit: item.areaUnit,

    bedrooms: item.bedrooms ? Number(item.bedrooms) : null,
    bathrooms: item.bathrooms ? Number(item.bathrooms) : null,
    floors: item.floors ? Number(item.floors) : null,

    furnishing: item.furnishing || null,

    features: item.features ? item.features.split("|") : [],

    images: item.images
      ? item.images.split("|").map((url: string, i: number) => ({
        url,
        order: i,
      }))
      : [],

    isFeatured: item.isFeatured === "true",
    isPublished: item.isPublished === "true",
  }));

  await Property.insertMany(properties);

  console.log(`✅ ${properties.length} properties imported from CSV`);
  process.exit(0);
}

seedFromCSV().catch((err) => {
  console.error(err);
  process.exit(1);
});