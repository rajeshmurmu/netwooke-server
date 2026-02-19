import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    role: {
      type: String,
      enum: ["member", "moderator"],
      default: "member",
    },
  },
  { timestamps: true },
);

groupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

const GroupMember =
  mongoose.models.GroupMember ||
  mongoose.model("GroupMember", groupMemberSchema);

export default GroupMember;
