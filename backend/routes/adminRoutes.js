import express from "express";
import {
  getAllUsers,
  getAllPosts,
  getAllComments,
  adminDeletePost,
  adminDeleteComment,
  getAdminStats,
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/posts", getAllPosts);
router.get("/comments", getAllComments);
router.delete("/posts/:id", adminDeletePost);
router.delete("/comments/:id", adminDeleteComment);

export default router;
