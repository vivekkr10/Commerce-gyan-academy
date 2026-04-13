import { addSubjects } from "../controllers/subject.controller.js";
import protect from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import express from "express";

const router = express.Router();

// Only admin can add subjects
router.post(
  "/admin/add-subject",
  protect,
  allowRoles("admin", "super_admin"),
  addSubjects,
);

export default router;
