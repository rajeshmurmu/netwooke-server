import { Post } from "@src/models";
import {
  uploadAudioToCloudinary,
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "@src/utils/cloudinary";

class PostService {
  static async createPost({
    content,
    mediaType,
    media,
    userId,
    tags,
  }: {
    content: string;
    mediaType: "image" | "audio" | "video" | "none";
    media: string;
    userId: string;
    tags?: string[];
  }) {
    // create post if no media
    if (mediaType === "none") {
      const post = new Post({
        userId,
        content,
      });
      await post.save();
      return post;
    }

    // create post
    const post = new Post({
      userId,
      content,
      mediaType,
      media,
      tags,
    });

    // upload image to cloudinary
    if (mediaType === "image") {
      const imageUrl = await uploadImageToCloudinary({
        filePath: media,
        post_id: post._id.toString(),
      });
      post.media = {
        url: imageUrl,
        public_id: post._id.toString(),
        mediaType: "image",
      };
    }

    if (mediaType === "audio") {
      const audioUrl = await uploadAudioToCloudinary({
        filePath: media,
        post_id: post._id.toString(),
      });
      post.media = {
        url: audioUrl,
        public_id: post._id.toString(),
        mediaType: "audio",
      };
    }

    if (mediaType === "video") {
      const videoUrl = await uploadVideoToCloudinary({
        filePath: media,
        post_id: post._id.toString(),
      });
      post.media = {
        url: videoUrl,
        public_id: post._id.toString(),
        mediaType: "video",
      };
    }

    // save post
    await post.save();
    return post;
  }
  static async getPosts({
    page,
    limit,
    skip,
    search,
  }: {
    page: number;
    limit: number;
    skip: number;
    search: string;
  }) {
    const posts = await Post.aggregate([
      {
        $match: {
          $or: [
            { content: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "postBy",
        },
      },
      { $unwind: "$postBy" },
      {
        $project: {
          "postBy.password": 0,
        },
      },
    ]);

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    return {
      posts,
      totalPosts,
      totalPages,
    };
  }
  static async updatePost() {}
  static async deletePost() {}
}

export default PostService;
