import express from "express";
import { uploadHomework, deleteHomework } from "../controllers/homework.controller.js";
import protect from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/teacher/homework/upload",
  protect,
  allowRoles("teacher", "admin", "super_admin"),
  uploadHomework,
);
router.delete(
  "/teacher/homework/delete/:id",
  protect,
  allowRoles("teacher", "admin", "super_admin"),
  deleteHomework,
);

export default router;
