import mongoose, { Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface AdminDocument extends mongoose.Document {
  email: string;
  password: string;
  role: "super_admin" | "admin";
  lastLogin?: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

const adminSchema = new mongoose.Schema<AdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin"],
      default: "admin",
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔐 Compare password
adminSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

const Admin: Model<AdminDocument> =
  mongoose.models.Admin || mongoose.model<AdminDocument>("Admin", adminSchema);

export default Admin;