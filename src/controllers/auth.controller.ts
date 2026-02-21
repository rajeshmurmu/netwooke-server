import config, {
  accessTokencookieOptions,
  refreshTokencookieOptions,
} from "@src/config";
import AuthService from "@src/services/auth.service";
import { ApiResponse } from "@src/utils/ApiResponse";
import asyncHandler from "@src/utils/asyncHandler";
import { getDeviceFingerPrint } from "@src/utils/deviceFingerPrint";
import { BadRequestError, ZodValidationError } from "@src/utils/error";
import { registerSchema } from "@src/utils/zod/registerSchema";
import { Request, Response } from "express";
import httpstatus from "http-status-codes";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;

  const validateData = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  });

  if (validateData.error && !validateData.success) {
    throw new ZodValidationError("Validation Error", validateData.error);
  }

  // send otp to email
  const { otpSessionId } = await AuthService.sendOtpToEmail(validateData.data);

  res
    .cookie("otpSessionId", otpSessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: config.OTP_TTL * 1000, // 5 minutes
    })
    .status(httpstatus.OK)
    .json(
      new ApiResponse({
        statusCode: httpstatus.OK,
        message: "OTP sent to your email",
      }),
    );
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { otp } = req.body;
  const { otpSessionId } = req.cookies;
  if (!otpSessionId) {
    throw new BadRequestError("OTP or OTP session are missing");
  }

  // verify otp
  const user = await AuthService.verifyOtpAndCreateUser(otp, otpSessionId);

  res
    .clearCookie("otpSessionId")
    .status(httpstatus.CREATED)
    .json(
      new ApiResponse({
        statusCode: httpstatus.CREATED,
        message: "OTP verified successfully",
        data: { user },
      }),
    );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const deviceId = getDeviceFingerPrint(req);

  const { user, accessToken, refreshToken } = await AuthService.login(
    email,
    password,
    deviceId,
  );

  res
    .cookie("accessToken", accessToken, accessTokencookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokencookieOptions)
    .status(httpstatus.OK)
    .json(
      new ApiResponse({
        statusCode: httpstatus.OK,
        message: "Logged in successfully",
        data: { user },
      }),
    );
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies || req.body;
    const { newAccessToken, newRefreshToken } =
      await AuthService.refreshAccessToken(
        refreshToken,
        getDeviceFingerPrint(req),
      );

    res
      .cookie("accessToken", newAccessToken, accessTokencookieOptions)
      .cookie("refreshToken", newRefreshToken, refreshTokencookieOptions)
      .status(httpstatus.OK)
      .json(
        new ApiResponse({
          statusCode: httpstatus.OK,
          message: "Access token refreshed successfully",
          data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
        }),
      );
  },
);
