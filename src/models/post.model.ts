import mongoose from "mongoose";
import { required } from "zod/v4/core/util.cjs";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    media: {
      type: {
        url: {
          type: String,
          required: function () {
            return this.mediaType !== "none";
          },
        },
        public_id: { type: String, required: false },
        mediaType: {
          type: String,
          enum: ["audio", "video", "image", "none"],
          defaul: "none",
        },
      },
      default: null,
    },

    visibility: {
      type: String,
      enum: ["public", "group", "private"],
      default: "public",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

postSchema.index({ userId: 1, createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
