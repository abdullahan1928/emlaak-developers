import mongoose, { Document, Model, Schema } from "mongoose";

interface IInquiry extends Document {
  name: string;
  phone: string;
  email?: string;
  message: string;
  propertyId?: mongoose.Types.ObjectId;
  status: "new" | "contacted" | "closed";
}

const inquirySchema = new Schema(
  {
    name: String,
    phone: String,
    email: String,
    message: String,

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },

    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiry> = mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", inquirySchema);

export default Inquiry;