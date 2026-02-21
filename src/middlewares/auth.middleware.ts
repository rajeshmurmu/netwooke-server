import { verifyAccessToken } from "@src/utils/auth";
import { UnauthorizedError } from "@src/utils/error";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user: { id: string };
}

export function requireAuth(
  req: AuthRequest | Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const accessToken =
      req.headers.authorization?.split("Bearer ")[1] || req.cookies.accessToken;

    if (!accessToken) {
      next(new UnauthorizedError("Access token is missing"));
    }

    // verify access token
    const { id } = verifyAccessToken(accessToken) as jwt.JwtPayload;

    (req as AuthRequest).user = {
      id,
    };

    // add user id to headers for proxied requests
    req.headers["x-user-id"] = id.toString();

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      next(new UnauthorizedError("Access token is expired"));
    }

    if (error.name === "JsonWebTokenError") {
      next(new UnauthorizedError("Access token is invalid"));
    }

    next(error);
  }
}
