import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authenticated" });
});

export default router;
