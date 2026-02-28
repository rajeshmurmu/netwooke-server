import express from "express";
import {
  checkModeratenity,
  generateReflectionPrompt,
} from "@src/controllers/genai.controller";
import { requireAuth } from "@src/middlewares/auth.middleware";

const router = express.Router();

router.route("/verify-moderatenity").post(requireAuth, checkModeratenity);
router
  .route("/get-reflection-prompt")
  .get(requireAuth, generateReflectionPrompt);

export default router;
