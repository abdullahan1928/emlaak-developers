import mongoose, { Document, Model, Schema } from "mongoose";

interface IProject extends Document {
  title: string;
  location: string;
  price: string;
  category: string;
  description: string;
  tags: string[];
  pictures: string[];
}

const projectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String, required: true }],
    pictures: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project;
