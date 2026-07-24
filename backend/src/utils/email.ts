import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a reusable transporter using default SMTP transport
export const createTransporter = async () => {
  // Use user-provided SMTP if available
  if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Otherwise fallback to Ethereal Email (for local dev/testing)
  console.log("No SMTP credentials found in .env. Falling back to Ethereal Email.");
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
};

export const sendVerificationEmail = async (email: string, code: string) => {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: '"Orean360 Auth" <no-reply@orean360.com>',
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333;">Welcome to Orean360</h2>
          <p>Please use the verification code below to verify your email address:</p>
          <div style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px; text-align: center; border-radius: 4px; margin: 20px 0; letter-spacing: 2px;">
            ${code}
          </div>
          <p style="color: #888; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log("Verification email sent: %s", info.messageId);
    
    // Preview only available when sending through an Ethereal account
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Preview URL: %s", previewUrl);
    }
    
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};
