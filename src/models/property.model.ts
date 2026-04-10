import { Category, IImage } from "@/enums/project.enum";
import { PropertyPurpose, PropertyStatus } from "@/enums/property.enum";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProperty extends Document {
  title: string;
  slug: string;
  location: string;
  city: string;
  price: number;
  type: Category;
  purpose: PropertyPurpose;
  description: string;
  features: string[];
  images: IImage[];
  status: PropertyStatus;
  isFeatured: boolean;
  area: number;
}

const propertySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },

    location: { type: String, required: true },
    city: { type: String, index: true },

    price: { type: Number, required: true, index: true },

    type: {
      type: String,
      enum: Category,
    },

    purpose: {
      type: String,
      enum: PropertyPurpose,
    },

    description: String,

    features: [{ type: String }],
    images: [
      {
        url: { type: String, required: true },
        order: { type: Number, default: 0 },
        public_id: String,
      },
    ],

    status: {
      type: String,
      enum: PropertyStatus,
      default: PropertyStatus.AVAILABLE,
    },

    isFeatured: { type: Boolean, default: false },

    area: Number,
  },
  { timestamps: true }
);

// Auto slug
propertySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

const Property: Model<IProperty> =
  mongoose.models.Property ||
  mongoose.model<IProperty>("Property", propertySchema);

export default Property;
