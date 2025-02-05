import mongoose from "mongoose";

const projectsSchema = new mongoose.Schema(
  {
    uz: {
      title: {
        type: String,
        required: true,
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
    },
    oz: {
      title: {
        type: String,
        required: true,
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
    },
    ru: {
      title: {
        type: String,
        required: true,
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
    },
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

const Projects = mongoose.models.Projects || mongoose.model("Projects", projectsSchema);
export default Projects;
