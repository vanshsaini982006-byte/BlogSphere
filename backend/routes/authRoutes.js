import express from "express";
import { body } from "express-validator";
import { register, login, getMe, logout } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Full name is required"),
    body("username").trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match");
      return true;
    }),
  ],
  register
);

router.post(
  "/login",
  [
    body("identifier").notEmpty().withMessage("Email or username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
