import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// Route to create a new user
router.post("/", userController.createUser);

// Route to get all users
router.get("/", userController.getAllUsers);

// Other routes for updating, deleting, etc. can be added as needed

export default router;
