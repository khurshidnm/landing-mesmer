import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInquiryFile {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export interface IInquiryUtm {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  referrer?: string;
}

export type InquiryStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "won"
  | "lost"
  | "spam";

export type InquiryPriority = "low" | "medium" | "high";

export interface IInquiry extends Document {
  name: string;
  company: string;
  country?: string;
  email: string;
  phone: string;
  inquiryTypes: string[];
  message: string;
  file?: IInquiryFile | null;
  utm?: IInquiryUtm;
  locale: "en" | "ru" | "uz";
  status: InquiryStatus;
  priority: InquiryPriority;
  notes?: string;
  assignedTo?: string;
  budget?: string;
  ip?: string;
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: "Uzbekistan",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    inquiryTypes: {
      type: [String],
      default: [],
    },
    message: {
      type: String,
      required: [true, "Project description or message is required"],
      trim: true,
    },
    file: {
      url: { type: String },
      filename: { type: String },
      originalName: { type: String },
      size: { type: Number },
      mimeType: { type: String },
    },
    utm: {
      source: { type: String, default: "" },
      medium: { type: String, default: "" },
      campaign: { type: String, default: "" },
      term: { type: String, default: "" },
      content: { type: String, default: "" },
      referrer: { type: String, default: "" },
    },
    locale: {
      type: String,
      enum: ["en", "ru", "uz"],
      default: "en",
    },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "proposal_sent",
        "won",
        "lost",
        "spam",
      ],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    notes: {
      type: String,
      default: "",
    },
    assignedTo: {
      type: String,
      default: "",
    },
    budget: {
      type: String,
      default: "",
    },
    ip: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", inquirySchema);

export default Inquiry;
