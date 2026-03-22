import { Router } from "express";
import { loginUser, registerUser, authMiddleware, getSocialConnections, connectSocial, disconnectSocial } from "../controllers/auth";
import { googleAuth } from "../controllers/googleAuth";

const router = Router();

// Auth routes
router.post("/register", registerUser as any);
router.post("/login", loginUser as any);
router.post("/google", googleAuth as any);

// Social connection routes (protected)
router.get("/social-connections", authMiddleware as any, getSocialConnections as any);
router.post("/social-connections", authMiddleware as any, connectSocial as any);
router.delete("/social-connections/:platform", authMiddleware as any, disconnectSocial as any);

router.get("/protected", authMiddleware as any, (req, res) => {
  res.json({ message: "You are authenticated" });
});

export default router;
