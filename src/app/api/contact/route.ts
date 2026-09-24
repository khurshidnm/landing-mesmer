import { NextResponse } from "next/server";
import axios from "axios";
import { connectToDatabase } from "@/lib/mongoose";
import Inquiry from "@/database/inquiry.model";
import { sendSalesNotificationEmail, sendSenderConfirmationEmail } from "@/lib/mail";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getClientIp, limitFormSubmission } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".jpg",
  ".jpeg",
  ".png",
]);

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "application/octet-stream",
]);

export async function POST(req: Request) {
  try {
    // 0. Rate limit per visitor IP (before reading the body)
    const ip = getClientIp(req.headers);
    const retryAfter = limitFormSubmission("contact", ip);
    if (retryAfter) {
      console.warn("[Spam blocked] Contact rate limit hit:", ip || "unknown IP");
      return NextResponse.json(
        {
          success: false,
          code: "rate_limited",
          error: "Too many submissions. Please wait a few minutes and try again.",
        },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    let name = "";
    let company = "";
    let country = "Uzbekistan";
    let email = "";
    let phone = "";
    let inquiryTypes: string[] = [];
    let message = "";
    let honeypot = "";
    let captchaToken = "";
    let locale: "en" | "ru" | "uz" = "en";
    let utm = {
      source: "",
      medium: "",
      campaign: "",
      term: "",
      content: "",
      referrer: "",
    };
    let uploadedFile: File | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = (formData.get("name") as string)?.trim() || "";
      company = (formData.get("company") as string)?.trim() || "";
      country = (formData.get("country") as string)?.trim() || "Uzbekistan";
      email = (formData.get("email") as string)?.trim().toLowerCase() || "";
      phone = (formData.get("phone") as string)?.trim() || "";
      message = (formData.get("message") as string)?.trim() || "";
      honeypot = (formData.get("website_url") as string)?.trim() || "";
      captchaToken = (formData.get("cf_turnstile_token") as string) || "";
      locale = ((formData.get("locale") as string) || "en") as "en" | "ru" | "uz";

      // Extract inquiry types (can be multiple entries or JSON)
      const rawTypes = formData.getAll("inquiryTypes");
      if (rawTypes.length > 0) {
        for (const item of rawTypes) {
          if (typeof item === "string") {
            try {
              const parsed = JSON.parse(item);
              if (Array.isArray(parsed)) {
                inquiryTypes.push(...parsed);
              } else {
                inquiryTypes.push(item);
              }
            } catch {
              inquiryTypes.push(item);
            }
          }
        }
      }

      // UTM metrics
      utm = {
        source: (formData.get("utm_source") as string) || "",
        medium: (formData.get("utm_medium") as string) || "",
        campaign: (formData.get("utm_campaign") as string) || "",
        term: (formData.get("utm_term") as string) || "",
        content: (formData.get("utm_content") as string) || "",
        referrer: (formData.get("referrer") as string) || "",
      };

      const fileEntry = formData.get("file");
      if (fileEntry instanceof File && fileEntry.size > 0) {
        uploadedFile = fileEntry;
      }
    } else {
      // Fallback for JSON requests (backward compatibility)
      const body = await req.json();
      name = body.name?.trim() || "";
      company = body.company?.trim() || "Individual / Private";
      country = body.country?.trim() || "Uzbekistan";
      email = body.email?.trim().toLowerCase() || "";
      phone = body.phone?.trim() || "";
      message = body.message?.trim() || "";
      honeypot = body.website_url?.trim() || "";
      captchaToken = body.cf_turnstile_token || "";
      locale = body.locale || "en";
      inquiryTypes = Array.isArray(body.inquiryTypes) ? body.inquiryTypes : [];
      utm = body.utm || utm;
    }

    // 1. Anti-spam Honeypot Check: if hidden field is filled, silently succeed
    if (honeypot) {
      console.warn("[Spam blocked] Honeypot triggered by submission:", { name, email, honeypot });
      return NextResponse.json({
        success: true,
        message: "Inquiry received successfully",
      });
    }

    // 2. Cloudflare Turnstile (only enforced when TURNSTILE_SECRET_KEY is set)
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

    // 3. Server-side Field Validation
    if (
      name.length > 200 ||
      company.length > 200 ||
      country.length > 100 ||
      email.length > 200 ||
      phone.length > 50 ||
      message.length > 10000 ||
      inquiryTypes.length > 20
    ) {
      return NextResponse.json(
        { success: false, error: "One or more fields are too long." },
        { status: 400 }
      );
    }

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid corporate email address." },
        { status: 400 }
      );
    }

    if (!phone || phone.length < 7) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid phone number with country/area code." },
        { status: 400 }
      );
    }

    if (!company) {
      company = "General Client / Private";
    }

    if (!message || message.length < 5) {
      return NextResponse.json(
        { success: false, error: "Please provide project description or requirements." },
        { status: 400 }
      );
    }

    // 4. File Validation & Upload Handling
    let fileMetadata = null;
    let fileBuffer: Buffer | null = null;

    if (uploadedFile) {
      if (uploadedFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: "File size exceeds the 10 MB limit." },
          { status: 400 }
        );
      }

      const ext = path.extname(uploadedFile.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          {
            success: false,
            error: `File type ${ext} is not allowed. Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG.`,
          },
          { status: 400 }
        );
      }

      if (uploadedFile.type && !ALLOWED_MIME_TYPES.has(uploadedFile.type)) {
        return NextResponse.json(
          { success: false, error: "Invalid file MIME type detected." },
          { status: 400 }
        );
      }

      const bytes = await uploadedFile.arrayBuffer();
      fileBuffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), "public", "uploads", "inquiries");
      await mkdir(uploadsDir, { recursive: true });

      const sanitizedOriginalName = uploadedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const safeFilename = `inquiry_${Date.now()}_${sanitizedOriginalName}`;
      const filePath = path.join(uploadsDir, safeFilename);

      await writeFile(filePath, fileBuffer);

      fileMetadata = {
        url: `/uploads/inquiries/${safeFilename}`,
        filename: safeFilename,
        originalName: uploadedFile.name,
        size: uploadedFile.size,
        mimeType: uploadedFile.type || "application/octet-stream",
      };
    }

    // 5. Save to MongoDB
    await connectToDatabase();

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "";

    const inquiryRecord = await Inquiry.create({
      name,
      company,
      country,
      email,
      phone,
      inquiryTypes: inquiryTypes.length > 0 ? inquiryTypes : ["General Inquiry"],
      message,
      file: fileMetadata,
      utm,
      locale,
      ip: clientIp,
      status: "new",
    });

    // 6. Telegram Notification
    const BOT_TOKEN =
      process.env.TELEGRAM_BOT_TOKEN ||
      "7848580576:AAE4Jgf2a0nj_I2kxkTMDScH8igTrHdj4cg";
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1002471201680";

    const escapeHtml = (str: string = "") =>
      str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const categoryList = inquiryTypes.length > 0 ? inquiryTypes.join(", ") : "Umumiy / General";

    const tgCaption = [
      "<b>🚀 Yangi B2B Loyiha Murojaati / Новая B2B Заявка!</b>\n",
      `<b>🏷 Turlar / Типы:</b> ${escapeHtml(categoryList)}`,
      `<b>🏢 Tashkilot / Компания:</b> ${escapeHtml(company)}`,
      `<b>🌍 Davlat / Страна:</b> ${escapeHtml(country)}`,
      `<b>👤 Vakil / Имя:</b> ${escapeHtml(name)}`,
      `<b>📞 Telefon:</b> ${escapeHtml(phone)}`,
      `<b>📧 Email:</b> ${escapeHtml(email)}`,
      `<b>💬 Loyiha tavsifi:</b>\n${escapeHtml(message)}`,
      utm.source ? `\n<b>📊 Manba:</b> ${escapeHtml(utm.source)} / ${escapeHtml(utm.medium)}` : "",
      fileMetadata ? `\n📎 <b>Fayl:</b> ${escapeHtml(fileMetadata.originalName)}` : "",
    ].filter(Boolean).join("\n");

    try {
      if (fileBuffer && uploadedFile) {
        const tgFormData = new FormData();
        tgFormData.append("chat_id", CHAT_ID);
        tgFormData.append("caption", tgCaption.substring(0, 1024));
        tgFormData.append("parse_mode", "HTML");
        tgFormData.append(
          "document",
          new Blob([new Uint8Array(fileBuffer)]),
          uploadedFile.name
        );

        await axios.post(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
          tgFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
          {
            chat_id: CHAT_ID,
            text: tgCaption,
            parse_mode: "HTML",
          }
        );
      }
    } catch (tgError) {
      console.error("Telegram notification failed:", tgError);
    }

    // 7. Asynchronous Email Dispatch (Sales notification + Sender confirmation)
    Promise.allSettled([
      sendSalesNotificationEmail(
        inquiryRecord,
        fileBuffer && uploadedFile ? { filename: uploadedFile.name, content: fileBuffer } : null
      ),
      sendSenderConfirmationEmail(inquiryRecord, locale),
    ]).catch((err) => console.error("Email dispatch error:", err));

    return NextResponse.json({
      success: true,
      message: "Inquiry received successfully",
      inquiryId: inquiryRecord._id,
    });
  } catch (error) {
    console.error("Error processing inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Internal server error occurred.",
      },
      { status: 500 }
    );
  }
}
