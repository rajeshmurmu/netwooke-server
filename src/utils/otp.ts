import { redisClient } from "@src/config/redis";
import { RegisterData } from "./zod/registerSchema";
import { BadRequestError, TooManyRequestsError } from "./error";
import otpGenerator from "otp-generator";
import crypto from "crypto";
import config from "../config";

function hmacFor(email: string, otp: string) {
  const hmac = crypto.createHmac("sha256", config.OTP_HMAC_SECRET);
  hmac.update(email + ":" + otp);
  return hmac.digest("hex");
}

export async function generateAndStoreOtp(meta: RegisterData) {
  const rateKey = `otp:rate:${meta.email}`; // Rate limit key
  const otpSentCount = parseInt((await redisClient.get(rateKey)) || "0", 10);

  if (otpSentCount >= 5) {
    throw new TooManyRequestsError(
      "Too many requests. Please try again later.",
    );
  }

  // generate otp
  //   const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });

  const otpSessionId = crypto.randomUUID();
  const hashedOtp = hmacFor(meta.email, otp);

  await redisClient.set(
    `otp:session:${otpSessionId}`,
    JSON.stringify({
      meta,
      hashedOtp,
    }),
    "EX",
    config.OTP_TTL,
  );

  // increment rate limit
  await redisClient.incr(rateKey);

  // expire rate limit key
  await redisClient.expire(rateKey, config.OTP_RATE_LIMIT_TTL);

  return { otp, otpSessionId };
}

export async function verifyOtp(otp: string, otpSessionId: string) {
  const otpSession = await redisClient.get(`otp:session:${otpSessionId}`);

  if (!otpSession) {
    throw new BadRequestError("OTP session expired please try again");
  }

  const { meta, hashedOtp } = JSON.parse(otpSession);

  const attemptKey = `otp:attempts:${meta.email}`;
  const attempts = parseInt((await redisClient.get(attemptKey)) || "0", 10);
  if (attempts >= config.OTP_VERIFICATION_MAX_ATTEMPTS) {
    throw new TooManyRequestsError(
      "Too many requests. Please try again later.",
    );
  }

  const hmacOtp = hmacFor(meta.email, otp);

  if (
    crypto.timingSafeEqual(
      Buffer.from(hmacOtp, "hex"),
      Buffer.from(hashedOtp, "hex"),
    )
  ) {
    await redisClient.del(`otp:session:${otpSessionId}`, attemptKey);
    await redisClient.del(`otp:rate:${meta.email}`);
    return meta;
  } else {
    await redisClient.incr(attemptKey);
    await redisClient.expire(attemptKey, config.OTP_TTL);
    return null;
  }
}
