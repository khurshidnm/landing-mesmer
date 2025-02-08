import mongoose from "mongoose";

const vacanciesSchema = new mongoose.Schema(
  {
    en: {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      conditions: [
        {
          type: String,
          required: true,
        },
      ],
      requirements: [
        {
          type: String,
          required: true,
        },
      ],
      responsibilities: [
        {
          type: String,
          required: true,
        },
      ],
    },
    uz: {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      conditions: [
        {
          type: String,
          required: true,
        },
      ],
      requirements: [
        {
          type: String,
          required: true,
        },
      ],
      responsibilities: [
        {
          type: String,
          required: true,
        },
      ],
    },
    ru: {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      conditions: [
        {
          type: String,
          required: true,
        },
      ],
      requirements: [
        {
          type: String,
          required: true,
        },
      ],
      responsibilities: [
        {
          type: String,
          required: true,
        },
      ],
    },
    salary: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    }
  },
  { timestamps: true }
);

const Vacancies =
  mongoose.models.Vacancies || mongoose.model("Vacancies", vacanciesSchema);
export default Vacancies;
