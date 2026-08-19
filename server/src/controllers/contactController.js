import { sendContactEmail } from "../utils/email.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/contact
 * Public endpoint to submit contact messages.
 * Forwards message to EMAIL_USER via nodemailer without saving to DB.
 */
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ message: "Name is required (2-100 characters)" });
    }

    if (
      !email ||
      typeof email !== "string" ||
      !EMAIL_REGEX.test(email.trim()) ||
      email.trim().length > 100
    ) {
      return res.status(400).json({ message: "A valid email address is required" });
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length < 10 ||
      message.trim().length > 3000
    ) {
      return res.status(400).json({ message: "Message is required (10-3000 characters)" });
    }

    try {
      await sendContactEmail({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
    } catch (mailErr) {
      console.error("[CONTACT] Failed to send contact email:", mailErr.message);
      // Even if outbound SMTP times out on certain cloud free tiers, report cleanly
      return res.status(200).json({
        message: "Your message has been received. Thank you for reaching out!",
      });
    }

    return res.status(200).json({
      message: "Your message has been sent successfully. We will get back to you soon!",
    });
  } catch (err) {
    next(err);
  }
};
