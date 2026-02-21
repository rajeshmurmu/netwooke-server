import { CookieOptions } from "express";

const _config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI,
  REDIS_URL: process.env.REDIS_URL,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  ALLOWED_ORIGINS:
    process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ||
    [],

  OTP_HMAC_SECRET:
    process.env.OTP_HMAC_SECRET ||
    "09dc0abbb2961391d822610b31b912e3231d4d2745c76b1ef4765af4c62f6079",

  OTP_RATE_LIMIT_TTL: process.env.OTP_RATE_LIMIT_TTL || 60 * 60, // 60 minutes
  OTP_TTL: Number(process.env.OTP_TTL) || 5 * 60, // 5 minutes
  OTP_VERIFICATION_MAX_ATTEMPTS:
    Number(process.env.OTP_VERIFICATION_MAX_ATTEMPTS) || 5,

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,

  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET ||
    "09dc0abbb2961391d822610b31b912e3231d4d2745c76b1ef4765af4c62f6079",
  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET ||
    "09dc0abbb2961391d822610b31b912e3231d4d2745c76b1ef4765af4c62f6079",

  ACCESS_TOKEN_EXPIRES_SEC: Number(process.env.ACCESS_TOKEN_EXPIRES_SEC), // 15 minutes 15 * 60
  REFRESH_TOKEN_EXPIRES_SEC: Number(process.env.REFRESH_TOKEN_EXPIRES_SEC), // 30 days 30 * 24 * 60 * 60

  ACCESS_TOKEN_TTL: Number(process.env.ACCESS_TOKEN_TTL) || 15 * 60, // 15 minutes
  REFRESH_TOKEN_TTL: Number(process.env.REFRESH_TOKEN_TTL) || 30 * 24 * 60 * 60, // 30 days

  REDIS_USER_TTL: Number(process.env.REDIS_USER_TTL) || 24 * 60 * 60, // 30 days
} as const;

const config = Object.freeze(_config);

export const accessTokencookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: config.ACCESS_TOKEN_TTL * 1000, // 15 minutes
};

export const refreshTokencookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: config.REFRESH_TOKEN_TTL * 1000, // 30 days
};

export default config;
