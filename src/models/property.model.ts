import mongoose, { Document, Model, Schema } from "mongoose";
import {
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
  AreaUnit,
  FurnishingStatus,
} from "@/enums/property.enum";
import { IImage } from "@/enums/project.enum";

export interface IProperty extends Document {
  // Core identity
  title: string;
  slug: string;
  description: string;

  // Classification
  type: PropertyType;
  purpose: PropertyPurpose;
  status: PropertyStatus;

  // Location
  location: string; // full address string e.g. "House 12, Street 4, F-7/1"
  city: string;     // e.g. "Islamabad"
  area: string;     // locality/sector e.g. "F-7", "DHA Phase 6"
  mapUrl?: string;

  // Pricing
  price: number;
  isNegotiable: boolean;

  // Physical attributes
  areaSize: number;
  areaUnit: AreaUnit;
  bedrooms?: number;     // undefined for plots/commercial
  bathrooms?: number;
  floors?: number;
  furnishing?: FurnishingStatus;

  // Features / amenities (flexible list)
  features: string[];

  // Media
  images: IImage[];

  // Metadata
  isFeatured: boolean;
  isPublished: boolean;

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true, trim: true },
    description: { type: String, default: "" },

    type: {
      type: String,
      enum: Object.values(PropertyType),
      required: true,
      index: true,
    },

    purpose: {
      type: String,
      enum: Object.values(PropertyPurpose),
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      default: PropertyStatus.AVAILABLE,
      index: true,
    },

    location: { type: String, required: true },
    city: { type: String, required: true, index: true },
    area: { type: String, default: "" },
    mapUrl: { type: String, default: "" },

    price: { type: Number, required: true, index: true },
    isNegotiable: { type: Boolean, default: false },

    areaSize: { type: Number, required: true },
    areaUnit: {
      type: String,
      enum: Object.values(AreaUnit),
      default: AreaUnit.MARLA,
    },

    bedrooms: { type: Number, default: null },
    bathrooms: { type: Number, default: null },
    floors: { type: Number, default: null },

    furnishing: {
      type: String,
      enum: Object.values(FurnishingStatus),
      default: null,
    },

    features: [{ type: String }],

    images: [
      {
        url: { type: String, required: true },
        order: { type: Number, default: 0 },
        public_id: { type: String, default: "" },
      },
    ],

    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },

    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-generate slug from title before saving
propertySchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }
  next();
});

// Compound index for efficient filtering
propertySchema.index({ purpose: 1, type: 1, city: 1, price: 1 });
propertySchema.index({ isPublished: 1, isFeatured: -1, createdAt: -1 });

const Property: Model<IProperty> =
  mongoose.models.Property ||
  mongoose.model<IProperty>("Property", propertySchema);

export default Property;