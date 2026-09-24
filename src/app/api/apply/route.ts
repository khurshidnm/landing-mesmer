import { NextResponse } from "next/server";
import axios from "axios";
import path from "path";
import { getClientIp, limitFormSubmission } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);

export async function POST(req: Request) {
  try {
    // Rate limit per visitor IP (before reading the body)
    const ip = getClientIp(req.headers);
    const retryAfter = limitFormSubmission("apply", ip);
    if (retryAfter) {
      console.warn("[Spam blocked] Apply rate limit hit:", ip || "unknown IP");
      return NextResponse.json(
        {
          success: false,
          code: "rate_limited",
          error: "Too many submissions. Please wait a few minutes and try again.",
        },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const formData = await req.formData();
    const name = (formData.get("name") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const email = (formData.get("email") as string) || "";
    const message = (formData.get("message") as string) || "";
    const jobTitle = (formData.get("jobTitle") as string) || "General Application";
    const file = (formData.get("file") as File) || null;
    const honeypot = ((formData.get("website_url") as string) || "").trim();
    const captchaToken = (formData.get("cf_turnstile_token") as string) || "";

    // Honeypot: bots fill the hidden field. Pretend success so they don't retry.
    if (honeypot) {
      console.warn("[Spam blocked] Apply honeypot triggered:", { name, email });
      return NextResponse.json({
        success: true,
        message: "Application submitted successfully",
      });
    }

    if (!(await verifyTurnstile(captchaToken, ip))) {
      return NextResponse.json(
        {
          success: false,
          code: "captcha_failed",
          error: "Security check failed. Please try again.",
        },
        { status: 400 }
      );
    }

    if (
      name.length > 200 ||
      phone.length > 50 ||
      email.length > 200 ||
      message.length > 5000 ||
      jobTitle.length > 300
    ) {
      return NextResponse.json(
        { success: false, error: "One or more fields are too long." },
        { status: 400 }
      );
    }

    if (file && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: "File size exceeds the 10 MB limit." },
          { status: 400 }
        );
      }
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { success: false, error: "Only PDF, DOC and DOCX files are allowed." },
          { status: 400 }
        );
      }
    }

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and at least one contact method (phone or email) are required.",
        },
        { status: 400 }
      );
    }

    const BOT_TOKEN =
      process.env.TELEGRAM_BOT_TOKEN ||
      "7049223832:AAH0qBWpoDVAWiCbMxH92HTNcC3JQ2zbHS4";
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1002471201680";

    const escapeHtml = (str: string = "") =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const text = [
      "<b>📨 Yangi rezyume / Отклик на вакансию!</b>\n",
      `<b>💼 Vakansiya / Вакансия:</b> ${escapeHtml(jobTitle)}`,
      `<b>👤 Nomzod / Имя:</b> ${escapeHtml(name)}`,
      `<b>📞 Telefon / Телефон:</b> ${escapeHtml(phone || "-")}`,
      `<b>📧 Email:</b> ${escapeHtml(email || "-")}`,
      `<b>💬 Xabar / Сообщение:</b> ${escapeHtml(message || "-")}`,
    ].join("\n");

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const tgFormData = new FormData();
      tgFormData.append("chat_id", CHAT_ID.toString());
      tgFormData.append("caption", text);
      tgFormData.append("parse_mode", "HTML");
      tgFormData.append(
        "document",
        new Blob([buffer], { type: file.type || "application/octet-stream" }),
        file.name
      );

      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
        tgFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } else {
      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          chat_id: CHAT_ID,
          text,
          parse_mode: "HTML",
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting job application:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
