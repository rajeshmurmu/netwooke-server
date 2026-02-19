import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    mediaUrl: { type: String },

    visibility: {
      type: String,
      enum: ["public", "group", "private"],
      default: "public",
    },
  },
  { timestamps: true },
);

postSchema.index({ userId: 1, createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
