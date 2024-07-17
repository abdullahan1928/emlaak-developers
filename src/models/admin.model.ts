import mongoose, { Model } from "mongoose";

export interface AdminDocument extends mongoose.Document {
  email: string;
  password: string;
}

// Define admin schema
const adminSchema = new mongoose.Schema<AdminDocument>({
  email: {
    type: String,
    required: [true, "Please provide an email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
});

// Define Admin model if it doesn't exist, otherwise use existing model
const Admin: Model<AdminDocument> =
  mongoose.models.Admin || mongoose.model<AdminDocument>("Admin", adminSchema);

export default Admin;
