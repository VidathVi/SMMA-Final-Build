import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import {
  getUsers,
  changeUserRole,
  removeUser,
  updateProfile,
} from "../controllers/userController";

const router = Router();

// GET all users — Admin & Manager only
router.get("/", authMiddleware, roleMiddleware(["admin", "manager"]), getUsers);

// PUT update user role — Admin only
router.put(
  "/:id/role",
  authMiddleware,
  roleMiddleware(["admin"]),
  changeUserRole,
);

// DELETE user — Admin only
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), removeUser);

// PUT update own profile — Any authenticated user
router.put("/profile", authMiddleware, updateProfile);

export default router;
