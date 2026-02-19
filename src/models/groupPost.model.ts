import mongoose from "mongoose";

const groupPostSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
  },
  { timestamps: true },
);

const GroupPost =
  mongoose.models.GroupPost || mongoose.model("GroupPost", groupPostSchema);

export default GroupPost;
