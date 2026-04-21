import Admin from "../src/models/admin.model";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "your-mongodb-uri-here";

async function seed() {
  await mongoose.connect(MONGODB_URI);

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existing = await Admin.findOne({ email: adminEmail });

  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const admin = new Admin({
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });

  await admin.save();
  console.log("Admin created successfully");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});