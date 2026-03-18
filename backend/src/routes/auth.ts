import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth";

const router = Router();

router.post("/register", registerUser as any);
router.post("/login", loginUser as any);

export default router;
