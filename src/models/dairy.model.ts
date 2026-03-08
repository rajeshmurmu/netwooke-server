import mongoose from "mongoose";

const diarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isPrivate: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Dairy = mongoose.models.Dairy || mongoose.model("Dairy", diarySchema);

export default Dairy;
