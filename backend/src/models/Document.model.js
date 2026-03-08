import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
filename: { type: String, required: true }
},
{ timestamps: true }
);

export default mongoose.model("Document", documentSchema);