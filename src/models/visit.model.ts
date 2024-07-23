import mongoose, { Document, Model, Schema } from "mongoose";

interface IVisit extends Document {
  path: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
}

const visitSchema: Schema = new Schema({
  path: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Visit: Model<IVisit> =
  mongoose.models.Visit || mongoose.model<IVisit>("Visit", visitSchema);

export default Visit;
