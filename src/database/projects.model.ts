import mongoose from "mongoose";

const projectsSchema = new mongoose.Schema(
  {
    uz: {
      title: {
        type: String,
        required: true,
      },
      main_title: {
        type: String,
        required: true,
        default: ""
      },
      description: {
        type: String,
        required: true,
      },
      volume_of_tasks: {
        type: String,
        required: true,
      },
      customer: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      implementation_period: {
        type: String,
        required: true,
      },
      meta_title: {
        type: String,
        default: "",
      },
      meta_description: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
    },
    en: {
      title: {
        type: String,
        required: true,
      },
      main_title: {
        type: String,
        required: true,
        default: ""
      },
      description: {
        type: String,
        required: true,
      },
      volume_of_tasks: {
        type: String,
        required: true,
      },
      customer: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      implementation_period: {
        type: String,
        required: true,
      },
      meta_title: {
        type: String,
        default: "",
      },
      meta_description: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
    },
    ru: {
      title: {
        type: String,
        required: true,
      },
      main_title: {
        type: String,
        required: true,
        default: ""
      },
      description: {
        type: String,
        required: true,
      },
      volume_of_tasks: {
        type: String,
        required: true,
      },
      customer: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      implementation_period: {
        type: String,
        required: true,
      },
      meta_title: {
        type: String,
        default: "",
      },
      meta_description: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
    },
    project_type: {
      type: String,
      default: "",
    },
    // Structured fields for the project database and its filters (spec 4.5).
    // Values are keys from src/lib/cms/definitions.ts (categories, contract
    // types, statuses) or a financier slug from Website Content → Financiers.
    country: { type: String, default: "UZ" }, // ISO 3166 code
    financier: { type: String, default: "" },
    contract_type: { type: String, default: "" },
    category: { type: String, default: "" },
    stage: { type: String, default: "" }, // completed | ongoing | commissioning
    capacity_value: { type: Number, default: null },
    capacity_unit: { type: String, default: "m³/day" },
    population_served: { type: Number, default: null },
    start_date: { type: String, default: "" }, // YYYY or YYYY-MM
    end_date: { type: String, default: "" }, // empty = ongoing
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    cover: {
      type: String,
      required: true,
    },
    gallery: {
      type: Array,
      required: true,
    }
  },
  { timestamps: true }
);

projectsSchema.index({ category: 1, financier: 1, stage: 1, country: 1 });

// In dev, hot reload re-runs this file while mongoose keeps the old cached model
if (process.env.NODE_ENV !== "production" && mongoose.models.Projects) {
  mongoose.deleteModel("Projects");
}

const Projects = mongoose.models.Projects || mongoose.model("Projects", projectsSchema);
export default Projects;
