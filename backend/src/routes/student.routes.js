import {
  getStudentById,
  updateStudentProfile,
} from "../controllers/student.controller.js";
import express from "express";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// NO :id needed
router.get("/student/:id", protect, getStudentById);
router.put("/student/edit-profile", protect, updateStudentProfile);

export default router;
