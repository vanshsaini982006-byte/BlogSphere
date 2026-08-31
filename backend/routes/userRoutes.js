import express from "express";
import { getUserProfile, updateUserProfile, getDashboard } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/me/dashboard", protect, getDashboard);
router.get("/:id", getUserProfile);
router.put("/:id", protect, updateUserProfile);

export default router;
