import {
  login,
  refreshAccessToken,
  register,
  verifyOtp,
} from "@src/controllers/auth.controller";
import express from "express";

const router = express.Router();

router.route("/register").post(register);
router.route("/verify-otp").post(verifyOtp);
router.route("/login").post(login);
router.route("/refresh-token").get(refreshAccessToken);

export default router;
