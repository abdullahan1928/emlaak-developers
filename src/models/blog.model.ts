import mongoose, { Document, Model, Schema } from "mongoose";
import { BlogStatus, BlogCategory } from "@/enums/blog.enum";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;           // short summary shown on listing cards
  content: string;           // rich HTML from QuillEditor
  coverImage: string;        // Cloudinary URL
  coverImagePublicId: string;
  category: BlogCategory;
  tags: string[];
  author: string;            // free text name
  status: BlogStatus;
  readTime?: number;         // minutes, auto-calculated on save
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true, trim: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    coverImagePublicId: { type: String, default: "" },
    category: {
      type: String,
      enum: Object.values(BlogCategory),
      default: BlogCategory.NEWS,
      index: true,
    },
    tags: [{ type: String }],
    author: { type: String, default: "Admin" },
    status: {
      type: String,
      enum: Object.values(BlogStatus),
      default: BlogStatus.DRAFT,
      index: true,
    },
    readTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-calculate read time from content word count (avg 200 wpm)
blogSchema.pre("save", function (next) {
  if (this.content) {
    const text = this.content.replace(/<[^>]+>/g, "");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    this.readTime = Math.max(1, Math.ceil(words / 200));
  }
  next();
});

blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ status: 1, category: 1 });

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;