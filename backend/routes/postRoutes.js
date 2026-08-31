import express from "express";
import { body } from "express-validator";
import {
  getPosts,
  getFeaturedPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { getComments, addComment } from "../controllers/commentController.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

const postValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("excerpt").trim().notEmpty().withMessage("Excerpt is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("category").notEmpty().withMessage("Category is required"),
];

router.get("/featured", getFeaturedPosts);
router.get("/", optionalAuth, getPosts);
router.get("/:id", optionalAuth, getPost);
router.post("/", protect, postValidation, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

router.get("/:postId/comments", getComments);
router.post("/:postId/comments", protect, addComment);

export default router;
