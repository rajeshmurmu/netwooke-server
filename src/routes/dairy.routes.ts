import express from "express";
import { createEntry, getEntries } from "@src/controllers/dairy.controller";
import { requireAuth } from "@src/middlewares/auth.middleware";

const router = express.Router();

router.route("/").post(requireAuth, createEntry).get(requireAuth, getEntries);

export default router;
