import mongoose, { Document, Model, Schema } from "mongoose";

interface IProject extends Document {
  title: string;
  location: string;
  price: string;
  category: string;
  views: number;
  description: string;
  pictures: string[];
}

const projectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
    views: { type: Number, default: 0 },
    description: { type: String, required: true },
    pictures: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project;
