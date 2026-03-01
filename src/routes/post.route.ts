import { createPost, getPosts } from "@src/controllers/post.controller";
import { requireAuth } from "@src/middlewares/auth.middleware";
import { upload } from "@src/middlewares/multer.middleware";
import express from "express";

const router = express.Router();

router
  .route("/")
  .get(getPosts)
  .post(requireAuth, upload.single("media"), createPost);

export default router;
