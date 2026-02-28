import GenAIService from "@src/services/genai.service";
import { ApiResponse } from "@src/utils/ApiResponse";
import asyncHandler from "@src/utils/asyncHandler";
import { BadRequestError } from "@src/utils/error";
import httpstatus from "http-status-codes";
import type { Request, Response } from "express";

export const checkModeratenity = asyncHandler(
  async (req: Request, res: Response) => {
    const { content } = req.body;
    if (!content) {
      throw new BadRequestError("Content is required");
    }

    const { isSafe, reason } = await GenAIService.moderateContent(content);

    return res.status(httpstatus.OK).json(
      new ApiResponse({
        statusCode: httpstatus.OK,
        message: "Moderation check completed",
        data: { isSafe, reason },
        success: true,
      }),
    );
  },
);

export const generateReflectionPrompt = asyncHandler(
  async (req: Request, res: Response) => {
    const reflectionPrompt = await GenAIService.generateReflectionPrompt();
    return res.status(httpstatus.OK).json(
      new ApiResponse({
        statusCode: httpstatus.OK,
        message: "Reflection prompt generated successfully",
        data: { reflectionPrompt },
        success: true,
      }),
    );
  },
);
