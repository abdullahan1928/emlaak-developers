import mongoose, { Document, Model, Schema } from "mongoose";

interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  image: string;
  tags: string[];
  published: boolean;
}

const blogSchema = new Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    content: String,
    image: String,
    tags: [String],
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

