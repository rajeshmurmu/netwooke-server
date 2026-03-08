import type { Request, Response } from "express";
import DairyService from "@src/services/dairy.service";
import { ApiResponse } from "@src/utils/ApiResponse";
import asyncHandler from "@src/utils/asyncHandler";
import httpStatus from "http-status-codes";
import { BadRequestError, UnauthorizedError } from "@src/utils/error";
import { AuthRequest } from "@src/middlewares/auth.middleware";

export const createEntry = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id; // Assuming user ID is available in the request object after authentication

    if (!userId) {
      throw new UnauthorizedError(
        "User must be authenticated to create a dairy entry",
      );
    }

    const title = req.body?.title;
    const content = req.body?.content;
    const isPrivate = req.body?.isPrivate;

    if (!title || !content) {
      throw new BadRequestError(
        "Title and content are required to create a dairy entry",
      );
    }

    // Logic to create a new dairy entry
    const entry = await DairyService.createEntry({
      title,
      content,
      isPrivate,
      userId,
    });

    return res.status(httpStatus.CREATED).json(
      new ApiResponse({
        message: "Dairy entry created successfully",
        data: { entry },
        success: true,
        statusCode: httpStatus.CREATED,
      }),
    );
  },
);

export const getEntries = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // Logic to retrieve all dairy entries

    const userId = req.user?.id; // Assuming user ID is available in the request object after authentication
    if (!userId) {
      throw new UnauthorizedError(
        "User must be authenticated to view dairy entries",
      );
    }

    const queryKey = req.query.q as "personal" | "community"; // Get the query parameter to determine which entries to fetch

    let entries;
    if (queryKey === "community") {
      entries = await DairyService.getPublicDairyEntries(userId);
    } else {
      entries = await DairyService.getDairyEnteries(userId);
    }

    res.status(200).json(
      new ApiResponse({
        message: "Dairy entries retrieved successfully",
        data: { entries },
        success: true,
        statusCode: httpStatus.OK,
      }),
    );
  },
);

export const getPublicEntries = asyncHandler(
  async (req: Request, res: Response) => {
    // Logic to retrieve all public dairy entries
    const entries = await DairyService.getPublicDairyEntries("userId");
    res.status(200).json(
      new ApiResponse({
        message: "Public dairy entries retrieved successfully",
        data: { entries },
        success: true,
        statusCode: httpStatus.OK,
      }),
    );
  },
);

export const getEntryById = (req: Request, res: Response) => {
  const { id } = req.params;
  // Logic to retrieve a specific dairy entry by ID
  res.status(200).json({ entry: {} }); // Replace with actual entry
};

export const updateEntry = (req: Request, res: Response) => {
  const { id } = req.params;
  // Logic to update a specific dairy entry by ID
  res.status(200).json({ message: "Dairy entry updated successfully" });
};

export const deleteEntry = (req: Request, res: Response) => {
  const { id } = req.params;
  // Logic to delete a specific dairy entry by ID
  res.status(200).json({ message: "Dairy entry deleted successfully" });
};
