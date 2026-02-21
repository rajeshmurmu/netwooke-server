import express from "express";
import {
  login,
  logout,
  refreshAccessToken,
  register,
  verifyOtp,
} from "@src/controllers/auth.controller";
import { requireAuth } from "@src/middlewares/auth.middleware";

const router = express.Router();

router.route("/register").post(register);
router.route("/verify-otp").post(verifyOtp);
router.route("/login").post(login);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/logout").get(requireAuth, logout);

export default router;
