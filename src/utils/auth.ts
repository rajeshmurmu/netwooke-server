import crypto from "crypto";
import config from "@src/config";
import jwt from "jsonwebtoken";

export const hashToken = (refreshToken: string) => {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
};

export const generateAccessToken = (userId: string) => {
  const payload = {
    id: userId,
  };
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRES_SEC || "15m",
  });
};

export const generateRefreshToken = (userId: string) => {
  const payload = {
    id: userId,
    jti: crypto.randomUUID(),
  };
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRES_SEC || "30d",
  });
};

export const verifyAccessToken = (accessToken: string) => {
  return jwt.verify(accessToken, config.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (refreshToken: string) => {
  return jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
};
