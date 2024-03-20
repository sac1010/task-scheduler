import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// Route to register a new user
router.post("/register", authController.registerUser);

// Route to login user and generate JWT token
router.post("/login", authController.loginUser);

export default router;
