import { Router } from "express";
import { authMiddleware } from "../controllers/auth";
import {
  generateWhatsAppQR,
  getWhatsAppStatus,
  sendWhatsAppMessage,
  whatsappWebhookVerify,
  whatsappWebhook,
  connectWhatsApp,
  disconnectWhatsApp,
} from "../controllers/whatsapp";

const router = Router();

// QR Code generation
router.get("/qr", authMiddleware as any, generateWhatsAppQR as any);

// Connection status
router.get("/status", authMiddleware as any, getWhatsAppStatus as any);

// Send message
router.post("/send", authMiddleware as any, sendWhatsAppMessage as any);

// Connect WhatsApp to user account
router.post("/connect", authMiddleware as any, connectWhatsApp as any);

// Webhook (public endpoints - used by Meta)
router.get("/webhook", whatsappWebhookVerify as any);
router.post("/webhook", whatsappWebhook as any);

// Disconnect
router.delete("/disconnect", authMiddleware as any, disconnectWhatsApp as any);

export default router;
