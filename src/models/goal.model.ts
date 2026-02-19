import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    category: { type: String },
  },
  { timestamps: true },
);

const Goal = mongoose.models.Goal || mongoose.model("Goal", goalSchema);

export default Goal;
