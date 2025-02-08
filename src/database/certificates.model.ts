import mongoose from "mongoose";

const certificatesSchema = new mongoose.Schema(
  {
    uz: {
      title: {
        type: String,
        required: true,
      },
    },
    en: {
      title: {
        type: String,
        required: true,
      },
    },
    ru: {
      title: {
        type: String,
        required: true,
      },
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Certificates =
  mongoose.models.Certificates ||
  mongoose.model("Certificates", certificatesSchema);
export default Certificates;
