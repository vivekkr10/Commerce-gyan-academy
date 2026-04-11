import { getTeacherProfile } from "../controllers/teacher.controller.js";
import protect from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.get("teacher/:id", protect, getTeacherProfile);

export default router;
