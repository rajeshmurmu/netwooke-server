import asyncHandler from "@src/utils/asyncHandler";
import { Request, Response } from "express";
import httpstatus from "http-status-codes";
import { ApiResponse } from "@src/utils/ApiResponse";
import { AuthRequest } from "@src/middlewares/auth.middleware";
import { BadRequestError, UnauthorizedError } from "@src/utils/error";
import PostService from "@src/services/post.service";
import config from "@src/config";
import GenAIService from "@src/services/genai.service";

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query?.page) || 1;
  const limit = Number(req.query?.limit) || config.POSTS_PER_PAGE_LIMIT;
  const skip = (page - 1) * limit;
  const search = (req.query?.search as string) || "";

  const { posts, totalPages, totalPosts } = await PostService.getPosts({
    page,
    limit,
    skip,
    search,
  });

  res.status(httpstatus.OK).json(
    new ApiResponse({
      statusCode: httpstatus.OK,
      message: "Posts fetched successfully",
      data: { posts },
      meta: { page, limit, totalPages, totalPosts },
    }),
  );
});

export const createPost = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError("User is not authenticated");
    }

    const content = req.body?.content;
    const mediaType = req.body?.mediaType;
    const media = req.file?.path;
    const tags = req.body?.tags;

    // validate required fields
    if (!content || !mediaType) {
      throw new BadRequestError("All fields are required");
    }

    // validate media type
    if (
      mediaType !== "image" &&
      mediaType !== "audio" &&
      mediaType !== "video" &&
      mediaType !== "none"
    ) {
      throw new BadRequestError("Invalid media type");
    }

    // validate media
    if (mediaType !== "none" && !media) {
      throw new BadRequestError("Media is required");
    }

    // validate tags
    if (tags && !Array.isArray(tags)) {
      throw new BadRequestError("Tags must be an array");
    }

    // verify moderatenity of content
    const { isSafe, reason } = await GenAIService.moderateContent(content);

    if (!isSafe) {
      throw new BadRequestError(
        `Network Tube is a safe space. Please refine your wisdom: ${reason}`,
      );
    }

    const post = await PostService.createPost({
      content,
      mediaType,
      media: media as string,
      userId,
      tags: tags.length > 0 ? tags : [],
    });

    res.status(httpstatus.OK).json(
      new ApiResponse({
        statusCode: httpstatus.OK,
        message: "Post created successfully",
        data: { post },
      }),
    );
  },
);
