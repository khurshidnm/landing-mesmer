import mongoose, { Schema } from "mongoose";

const constantsSchema = new Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    default: "info@mesmer.uz"
  },
  number: {
    type: String,
    required: false,
    trim: true,
    default: "+ 998 (55) 518 88 70"
  },
  location: {
    type: String,
    required: false,
    default: ""
  },
  address: {
    uz: { type: String, default: "" },
    ru: { type: String, default: "" },
    en: { type: String, default: "" },
  },
  profile_pdf: {
    type: String,
    required: false,
    default: ""
  },
  footer_bg: {
    type: String,
    required: false,
    default: ""
  },
  logo: {
    type: String,
    required: false,
    default: "/blacklogo.svg"
  },
  services_seo: {
    uz: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
    en: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
    ru: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
  }
});

// In dev, hot reload re-runs this file while mongoose keeps the old cached model,
// so schema changes (new fields) would be silently dropped on save.
if (process.env.NODE_ENV !== "production" && mongoose.models.Constants) {
  mongoose.deleteModel("Constants");
}

const Constants = mongoose.models.Constants || mongoose.model("Constants", constantsSchema);
export default Constants;