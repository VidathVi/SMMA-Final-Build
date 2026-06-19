import { Response } from "express";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  getAllUsers,
  findUserById,
  updateUserRole,
  updateUserProfile,
  deleteUserById,
} from "../models/userModel";

// GET ALL USERS (Admin, Manager only)
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (error: any) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE USER ROLE (Admin only)
export const changeUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["admin", "manager", "designer", "approver", "user"];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
      });
    }

    const user = await findUserById(Number(id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updated = await updateUserRole(Number(id), role);
    res.json({ message: "User role updated", user: updated });
  } catch (error: any) {
    console.error("Update Role Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE USER (Admin only)
export const removeUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user && req.user.id === Number(id)) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const user = await findUserById(Number(id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await deleteUserById(Number(id));
    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE OWN PROFILE (Any authenticated user)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, password } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    let hashedPassword: string | undefined;
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updated = await updateUserProfile(userId, name, hashedPassword);
    res.json({ message: "Profile updated", user: updated });
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
