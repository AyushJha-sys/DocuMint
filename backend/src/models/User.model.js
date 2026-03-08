import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  credits: {
    type: Number,
    default: 100
  },

  signedDocuments: {
    type: Number,
    default: 0
  }
},
{
  timestamps: true
}
);

export default mongoose.model("User", userSchema);