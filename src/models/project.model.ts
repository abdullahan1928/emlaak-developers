import {
  IImage,
  Category,
  ProjectStatus,
  PublishStatus,
  AreaUnit,
} from "@/enums/project.enum";
import mongoose, { Document, Model, Schema } from "mongoose";

// Payment plan structure for installment-based projects
export interface IPaymentPlan {
  downPaymentPercent: number;  // e.g. 20 (%)
  installmentMonths: number;   // e.g. 48 (months)
  installmentAmount?: number;  // optional monthly amount in PKR
  possessionPercent?: number;  // % paid at possession
  note?: string;               // free text e.g. "2-year easy installments"
}

export interface IProject extends Document {
  // ── Core identity ──────────────────────────────────────────────
  title: string;
  slug: string;
  developerName?: string;      // e.g. "DHA", "Bahria Town"

  // ── Classification ─────────────────────────────────────────────
  category: Category;
  projectStatus: ProjectStatus;
  status: PublishStatus;

  // ── Location ───────────────────────────────────────────────────
  location: string;
  city: string;
  mapUrl?: string;

  // ── Pricing ────────────────────────────────────────────────────
  startingPrice: number;
  maxPrice?: number;           // optional upper range

  // ── Unit sizes ─────────────────────────────────────────────────
  minArea?: number;
  maxArea?: number;
  areaUnit?: AreaUnit;

  // ── Project details ────────────────────────────────────────────
  totalUnits?: number;         // total flats / plots in the project
  completionDate?: Date;

  // ── Rich content ───────────────────────────────────────────────
  description: string;
  amenities: string[];         // structured list: "Swimming Pool", "Gym"...
  tags: string[];              // SEO / search tags
  paymentPlan?: IPaymentPlan;

  // ── Media ──────────────────────────────────────────────────────
  images: IImage[];
  videoUrl?: string;           // YouTube embed URL
  brochureUrl?: string;        // PDF download link

  // ── SEO ────────────────────────────────────────────────────────
  metaTitle?: string;
  metaDescription?: string;

  createdAt: Date;
  updatedAt: Date;
}

const paymentPlanSchema = new Schema<IPaymentPlan>(
  {
    downPaymentPercent: { type: Number, required: true },
    installmentMonths: { type: Number, required: true },
    installmentAmount: Number,
    possessionPercent: Number,
    note: String,
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true, trim: true },
    developerName: { type: String, default: "" },

    category: {
      type: String,
      enum: Object.values(Category),
      default: Category.RESIDENTIAL,
      index: true,
    },

    projectStatus: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.ONGOING,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(PublishStatus),
      default: PublishStatus.DRAFT,
      index: true,
    },

    location: { type: String, default: "" },
    city: { type: String, default: "", index: true },
    mapUrl: { type: String, default: "" },

    startingPrice: { type: Number, required: true, index: true },
    maxPrice: { type: Number, default: null },

    minArea: { type: Number, default: null },
    maxArea: { type: Number, default: null },
    areaUnit: {
      type: String,
      enum: Object.values(AreaUnit),
      default: AreaUnit.MARLA,
    },

    totalUnits: { type: Number, default: null },
    completionDate: { type: Date, default: null },

    description: { type: String, default: "" },
    amenities: [{ type: String }],
    tags: [{ type: String }],
    paymentPlan: { type: paymentPlanSchema, default: null },

    images: [
      {
        url: { type: String, required: true },
        order: { type: Number, default: 0 },
        public_id: { type: String, default: "" },
      },
    ],

    videoUrl: { type: String, default: "" },
    brochureUrl: { type: String, default: "" },

    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound indexes
projectSchema.index({ status: 1, projectStatus: 1, category: 1 });
projectSchema.index({ status: 1, startingPrice: 1 });

const Project: Model<IProject> =
  mongoose.models.Project ||
  mongoose.model<IProject>("Project", projectSchema);

export default Project;