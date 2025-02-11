import { Schema, model } from "mongoose";

const ContactSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  number: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
});

export const Contact = model("Contact", ContactSchema);
