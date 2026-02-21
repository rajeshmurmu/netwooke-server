import { AuthRequest } from "@src/middlewares/auth.middleware";
import UserService from "@src/services/user.service";
import { ApiResponse } from "@src/utils/ApiResponse";
import asyncHandler from "@src/utils/asyncHandler";
import { BadRequestError } from "@src/utils/error";
import { Response } from "express";
import httpstatus from "http-status-codes";

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userid = req.user?.id;

    if (!userid) {
      throw new BadRequestError("UserId is required");
    }

    const user = await UserService.getProfile(userid);

    res.status(httpstatus.OK).json(
      new ApiResponse({
        statusCode: httpstatus.OK,
        message: "User profile fetched successfully",
        data: { user },
      }),
    );
  },
);
