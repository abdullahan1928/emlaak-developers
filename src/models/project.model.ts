import { IImage, Category, ProjectStatus, PublishStatus } from "@/enums/project.enum";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;

  location: string;
  mapUrl?: string;

  startingPrice: number;

  description: string;

  category?: Category;
  tags: string[];

  images: IImage[];

  status: PublishStatus;
  projectStatus: ProjectStatus;

  completionDate?: Date;

  metaTitle?: string;
  metaDescription?: string;
}

const projectSchema = new Schema(
  {
    title: { type: String, required: true },

    slug: { type: String, unique: true, index: true },

    location: String,
    mapUrl: String,

    startingPrice: Number,

    description: String,

    category: {
      type: String,
      enum: Object.values(Category),
      default: Category.RESIDENTIAL,
    },

    tags: [String],

    images: [
      {
        url: { type: String, required: true },
        order: { type: Number, default: 0 },
        public_id: String,
      },
    ],

    status: {
      type: String,
      enum: Object.values(PublishStatus),
      default: PublishStatus.DRAFT,
    },

    projectStatus: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.ONGOING,
    },

    completionDate: Date,

    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project;
