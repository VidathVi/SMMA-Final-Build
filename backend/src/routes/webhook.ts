import { Router } from "express";
import {
  handleMetaWebhook,
  receiveMetaWebhook,
  handleWhatsAppWebhook,
  receiveWhatsAppWebhook,
} from "../controllers/webhook";

const router = Router();

// Meta/Facebook/Instagram Webhooks
router.get("/meta", handleMetaWebhook);
router.post("/meta", receiveMetaWebhook);

// WhatsApp Webhooks
router.get("/whatsapp", handleWhatsAppWebhook);
router.post("/whatsapp", receiveWhatsAppWebhook);

export default router;
