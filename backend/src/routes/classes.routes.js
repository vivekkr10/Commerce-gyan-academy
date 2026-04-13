import { addClass, deleteClass } from "../controllers/classes.controller.js";
import protect from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import express from "express";

const router = express.Router();

router.post(
  "/admin/add-class",
  protect,
  allowRoles("admin", "super_admin"),
  addClass,
);
router.delete(
  "/admin/delete-class/:id",
  protect,
  allowRoles("admin", "super_admin"),
  deleteClass,
);

export default router;
