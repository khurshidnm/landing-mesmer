import mongoose, { Schema } from "mongoose";

const constantsSchema = new Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    default: "example@gmail.com"
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
  logo: {
    type: String,
    required: false,
    default: "/blacklogo.svg"
  }
});

const Constants = mongoose.models.Constants || mongoose.model("Constants", constantsSchema);
export default Constants;