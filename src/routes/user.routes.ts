import { getProfile } from "@src/controllers/user.controller";
import { requireAuth } from "@src/middlewares/auth.middleware";
import express from "express";

const router = express.Router();

router.route("/profile").get(requireAuth, getProfile);

export default router;
