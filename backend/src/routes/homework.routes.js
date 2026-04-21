import express from "express";
import { uploadHomework } from "../controllers/homework.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/teacher/upload", uploadHomework);

export default router;
