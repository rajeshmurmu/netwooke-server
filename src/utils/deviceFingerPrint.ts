import { Request } from "express";
import crypto from "crypto";

export function getDeviceFingerPrint(req: Request) {
  const userAgent = req.headers["user-agent"] || "";
  const ip =
    req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const accept = req.headers["accept"] || "";

  const raw = `${userAgent}|${ip}|${accept}`;
  const hash = crypto
    .createHash("sha256")
    .update(raw)
    .digest("hex")
    .slice(0, 16); // short device id
  return hash;
}
