import config from "@src/config";
import { redisClient } from "@src/config/redis";
import { User } from "@src/models";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@src/utils/auth";
import { otpVerifySuccesfullEmail, sendEmailOtp } from "@src/utils/email";
import { BadRequestError, ConflictError } from "@src/utils/error";
import { generateAndStoreOtp, verifyOtp } from "@src/utils/otp";
import { RegisterData } from "@src/utils/zod/registerSchema";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

class AuthService {
  static async sendOtpToEmail(registerData: RegisterData) {
    // check for user existance
    const user = await User.findOne({
      email: registerData.email,
      isVerified: true,
    });

    if (user) {
      throw new ConflictError("User already exist");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    // generate otp
    const { otp, otpSessionId } = await generateAndStoreOtp({
      ...registerData,
      password: hashedPassword,
    });

    // send otp to email
    await sendEmailOtp(registerData.email, otp);

    return {
      otp,
      otpSessionId,
    };
  }

  static async verifyOtpAndCreateUser(otp: string, otpSessionId: string) {
    const meta = await verifyOtp(otp, otpSessionId);
    if (meta === null) {
      throw new BadRequestError("Invalid OTP or session expired");
    }

    const { name, email, password } = meta;

    // create user
    const user = await User.create({
      name,
      email,
      password,
      isVerified: true,
      username: email.split("@")[0],
    });

    user.password = undefined;

    // send success email
    await otpVerifySuccesfullEmail(email);

    return user;
  }

  static async login(email: string, password: string, deviceId: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError("Invalid Credentials");
    }

    if (!user.isVerified) {
      throw new BadRequestError("Please verify your email");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const { jti } = jwt.decode(refreshToken) as JwtPayload;

    // store refresh token in redis
    await redisClient.set(
      `refreshToken:${user._id}:${deviceId}`,
      jti as string,
      "EX",
      config.REFRESH_TOKEN_TTL,
    );

    user.password = undefined;

    // store user in redis
    await redisClient.set(
      `user:${user._id}`,
      JSON.stringify(user),
      "EX",
      config.REDIS_USER_TTL,
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  static async refreshAccessToken(refreshToken: string, deviceId: string) {
    const { id: userId, jti } = verifyRefreshToken(refreshToken) as JwtPayload;
    const storedJti = await redisClient.get(
      `refreshToken:${userId}:${deviceId}`,
    );

    if (!storedJti) {
      throw new BadRequestError("Session expired please login again");
    }

    if (storedJti !== jti) {
      await redisClient.del(`refreshToken:${userId}:${deviceId}`);
      throw new BadRequestError("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    const { jti: newJti } = jwt.decode(newRefreshToken) as JwtPayload;

    // store refresh token in redis
    await redisClient.set(
      `refreshToken:${userId}:${deviceId}`,
      newJti as string,
      "EX",
      config.REFRESH_TOKEN_TTL,
    );

    return {
      newAccessToken,
      newRefreshToken,
    };
  }
}

export default AuthService;
