import { Request, Response } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
}
import axios from "axios";
import QRCode from "qrcode";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const WHATSAPP_API_VERSION = "v19.0";
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_VERIFY_TOKEN =
  process.env.WHATSAPP_VERIFY_TOKEN || "orean360_whatsapp_verify";
const WHATSAPP_API_BASE = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

// Generate QR code for WhatsApp Business linking
export const generateWhatsAppQR = async (req: Request, res: Response) => {
  try {
    // If using WhatsApp Cloud API, generate QR for the business number
    if (WHATSAPP_PHONE_NUMBER_ID && WHATSAPP_ACCESS_TOKEN) {
      // Generate QR code via WhatsApp Business API
      const response = await axios.post(
        `${WHATSAPP_API_BASE}/${WHATSAPP_PHONE_NUMBER_ID}/message_qrdls`,
        {
          prefilled_message: "Hi! I'd like to connect with Orean 360.",
          generate_qr_image: "SVG",
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      return res.json({
        qrCode: response.data.qr_image_url,
        deepLink: response.data.deep_link_url,
        qrCodeId: response.data.code,
      });
    }

    // Fallback: Generate a QR code that links to WhatsApp directly
    const phoneNumber = process.env.WHATSAPP_PHONE_NUMBER || "";
    const message = encodeURIComponent("Hi! Connecting from Orean 360.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    const qrDataUrl = await QRCode.toDataURL(whatsappUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#075E54",
        light: "#FFFFFF",
      },
    });

    res.json({
      qrCode: qrDataUrl,
      deepLink: whatsappUrl,
      type: "direct_link",
    });
  } catch (error: any) {
    console.error("WhatsApp QR Error:", error.response?.data || error);
    res.status(500).json({ message: "Failed to generate WhatsApp QR code" });
  }
};

// Get WhatsApp connection status
export const getWhatsAppStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
      return res.json({
        connected: false,
        message: "WhatsApp Business API not configured",
      });
    }

    // Check phone number status
    const response = await axios.get(
      `${WHATSAPP_API_BASE}/${WHATSAPP_PHONE_NUMBER_ID}`,
      {
        params: {
          fields:
            "verified_name,code_verification_status,display_phone_number,quality_rating",
          access_token: WHATSAPP_ACCESS_TOKEN,
        },
      },
    );

    // Check if user has a WhatsApp connection stored
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM social_tokens WHERE user_id = $1 AND platform = 'whatsapp'",
        [userId],
      );

      res.json({
        connected: result.rows.length > 0,
        phoneNumber: response.data.display_phone_number,
        verifiedName: response.data.verified_name,
        qualityRating: response.data.quality_rating,
        status: response.data.code_verification_status,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("WhatsApp Status Error:", error.response?.data || error);
    res.status(500).json({ message: "Failed to get WhatsApp status" });
  }
};

// Send WhatsApp message
export const sendWhatsAppMessage = async (req: Request, res: Response) => {
  const { to, message, templateName, templateLanguage } = req.body;

  if (!to) {
    return res.status(400).json({ message: "Recipient phone number required" });
  }

  try {
    let payload: any;

    if (templateName) {
      // Template message
      payload = {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: templateLanguage || "en_US" },
        },
      };
    } else if (message) {
      // Text message
      payload = {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      };
    } else {
      return res
        .status(400)
        .json({ message: "Message or template name required" });
    }

    const response = await axios.post(
      `${WHATSAPP_API_BASE}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    res.json({
      message: "Message sent successfully",
      messageId: response.data.messages?.[0]?.id,
      status: response.data.messages?.[0]?.message_status,
    });
  } catch (error: any) {
    console.error("WhatsApp Send Error:", error.response?.data || error);
    res.status(500).json({ message: "Failed to send WhatsApp message" });
  }
};

// WhatsApp webhook verification (GET)
export const whatsappWebhookVerify = (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    console.log("WhatsApp webhook verified");
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
};

// WhatsApp webhook handler (POST) - receives incoming messages & status updates
export const whatsappWebhook = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (body.object !== "whatsapp_business_account") {
      return res.sendStatus(404);
    }

    // Process each entry
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;

        if (value.messages) {
          // Handle incoming messages
          for (const msg of value.messages) {
            console.log("Incoming WhatsApp message:", {
              from: msg.from,
              type: msg.type,
              text: msg.text?.body,
              timestamp: msg.timestamp,
            });

            // TODO: Store message in database and/or forward to inbox
          }
        }

        if (value.statuses) {
          // Handle message status updates
          for (const status of value.statuses) {
            console.log("WhatsApp message status:", {
              messageId: status.id,
              status: status.status,
              recipientId: status.recipient_id,
              timestamp: status.timestamp,
            });
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error: any) {
    console.error("WhatsApp Webhook Error:", error);
    res.sendStatus(500);
  }
};

// Store WhatsApp connection for a user
export const connectWhatsApp = async (req: AuthRequest, res: Response) => {
  const { phoneNumber, displayName } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number required" });
  }

  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO social_tokens (user_id, platform, access_token, platform_user_id, platform_username)
         VALUES ($1, 'whatsapp', $2, $3, $4)
         ON CONFLICT (user_id, platform)
         DO UPDATE SET access_token = $2, platform_user_id = $3, platform_username = $4, updated_at = CURRENT_TIMESTAMP`,
        [
          userId,
          WHATSAPP_ACCESS_TOKEN || "configured",
          phoneNumber,
          displayName || phoneNumber,
        ],
      );

      await client.query(
        `INSERT INTO social_connections (user_id, platform, platform_username, profile_url)
         VALUES ($1, 'whatsapp', $2, $3)
         ON CONFLICT (user_id, platform)
         DO UPDATE SET platform_username = $2, profile_url = $3, connected_at = CURRENT_TIMESTAMP`,
        [userId, displayName || phoneNumber, `https://wa.me/${phoneNumber}`],
      );
    } finally {
      client.release();
    }

    res.json({ message: "WhatsApp connected successfully" });
  } catch (error: any) {
    console.error("WhatsApp Connect Error:", error);
    res.status(500).json({ message: "Failed to connect WhatsApp" });
  }
};

// Disconnect WhatsApp
export const disconnectWhatsApp = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const client = await pool.connect();
    try {
      await client.query(
        "DELETE FROM social_tokens WHERE user_id = $1 AND platform = 'whatsapp'",
        [userId],
      );
      await client.query(
        "DELETE FROM social_connections WHERE user_id = $1 AND platform = 'whatsapp'",
        [userId],
      );
    } finally {
      client.release();
    }

    res.json({ message: "WhatsApp disconnected successfully" });
  } catch (error: any) {
    console.error("WhatsApp Disconnect Error:", error);
    res.status(500).json({ message: "Failed to disconnect WhatsApp" });
  }
};
