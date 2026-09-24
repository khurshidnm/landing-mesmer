import nodemailer from "nodemailer";
import type { IInquiry } from "@/database/inquiry.model";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return null;
}

export async function sendSalesNotificationEmail(
  inquiry: IInquiry,
  fileAttachment?: { filename: string; content: Buffer } | null
) {
  const transporter = getTransporter();
  const salesEmail = process.env.SALES_EMAIL || "info@mesmer.uz";

  const subject = `[New B2B Inquiry] ${inquiry.company} (${inquiry.country || "Uzbekistan"}) - ${inquiry.inquiryTypes.join(", ") || "General Inquiry"}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 20px; background-color: #f8fafc; }
          .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #003882; color: #ffffff; padding: 24px 32px; }
          .content { padding: 32px; }
          .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-right: 6px; margin-bottom: 6px; }
          .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #64748b; margin-bottom: 4px; }
          .field-value { font-size: 15px; font-weight: 500; color: #0f172a; margin-bottom: 16px; }
          .message-box { background: #f1f5f9; padding: 16px; border-radius: 8px; border-left: 4px solid #003882; font-size: 14px; white-space: pre-wrap; }
          .table-meta { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; color: #64748b; }
          .table-meta td { padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
          .footer { text-align: center; padding: 16px; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2 style="margin: 0; font-size: 20px;">Новая заявка: Start a Project with MESMER</h2>
            <p style="margin: 4px 0 0 0; opacity: 0.85; font-size: 13px;">B2B Лид с сайта mesmer.uz</p>
          </div>
          <div class="content">
            <div style="margin-bottom: 20px;">
              <div class="field-label">Типы обращения</div>
              <div>
                ${(inquiry.inquiryTypes || []).map((t) => `<span class="badge">${t}</span>`).join("")}
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <div class="field-label">Имя клиента</div>
                <div class="field-value">${inquiry.name}</div>
              </div>
              <div>
                <div class="field-label">Компания / Организация</div>
                <div class="field-value">${inquiry.company}</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <div class="field-label">Страна / Регион</div>
                <div class="field-value">${inquiry.country || "Uzbekistan"}</div>
              </div>
              <div>
                <div class="field-label">Телефон</div>
                <div class="field-value"><a href="tel:${inquiry.phone}" style="color: #003882;">${inquiry.phone}</a></div>
              </div>
            </div>

            <div>
              <div class="field-label">Email</div>
              <div class="field-value"><a href="mailto:${inquiry.email}" style="color: #003882;">${inquiry.email}</a></div>
            </div>

            <div>
              <div class="field-label">Описание проекта / Технические требования</div>
              <div class="message-box">${inquiry.message}</div>
            </div>

            ${
              inquiry.file
                ? `
            <div style="margin-top: 20px; padding: 12px 16px; background: #eff6ff; border-radius: 8px;">
              <div class="field-label" style="color: #1e40af;">Прикрепленный файл</div>
              <div style="font-size: 14px; font-weight: 600;">
                📎 ${inquiry.file.originalName} (${(inquiry.file.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
              <div style="margin-top: 4px;">
                <a href="${inquiry.file.url}" target="_blank" style="color: #2563eb; font-size: 13px; font-weight: 500;">Скачать файл с сервера</a>
              </div>
            </div>`
                : ""
            }

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
              <div class="field-label">Маркетинговые данные (UTM & Источник)</div>
              <table class="table-meta">
                <tr><td>UTM Source:</td><td><b>${inquiry.utm?.source || "direct"}</b></td></tr>
                <tr><td>UTM Medium:</td><td><b>${inquiry.utm?.medium || "-"}</b></td></tr>
                <tr><td>UTM Campaign:</td><td><b>${inquiry.utm?.campaign || "-"}</b></td></tr>
                <tr><td>Referrer:</td><td>${inquiry.utm?.referrer || "-"}</td></tr>
                <tr><td>Язык формы:</td><td>${inquiry.locale.toUpperCase()}</td></tr>
                <tr><td>IP адрес:</td><td>${inquiry.ip || "Не определен"}</td></tr>
              </table>
            </div>
          </div>
          <div class="footer">
            MESMER EPC Management System • mesmer.uz
          </div>
        </div>
      </body>
    </html>
  `;

  if (transporter) {
    try {
      const attachments = fileAttachment
        ? [{ filename: fileAttachment.filename, content: fileAttachment.content }]
        : [];

      await transporter.sendMail({
        from: `"MESMER Platform" <${process.env.SMTP_FROM || salesEmail}>`,
        to: salesEmail,
        replyTo: inquiry.email,
        subject,
        html,
        attachments,
      });
      console.log("[Mail] Sales notification email delivered to:", salesEmail);
    } catch (err) {
      console.error("[Mail] Failed to send sales email via SMTP:", err);
    }
  } else {
    console.log(
      `[Mail Simulation] SMTP credentials not configured. Sales notification prepared for: ${salesEmail} (Subject: ${subject})`
    );
  }
}

export async function sendSenderConfirmationEmail(
  inquiry: IInquiry,
  locale: "en" | "ru" | "uz" = "en"
) {
  const transporter = getTransporter();
  const salesEmail = process.env.SALES_EMAIL || "info@mesmer.uz";

  const subjects = {
    en: "Thank you for contacting MESMER | Project Inquiry Received",
    ru: "Благодарим за обращение в MESMER | Ваша заявка принята",
    uz: "MESMER kompaniyasiga murojaatingiz uchun tashakkur | Arizangiz qabul qilindi",
  };

  const templates = {
    en: {
      title: "Your Project Inquiry has been received",
      greeting: `Dear ${inquiry.name},`,
      body: `Thank you for your interest in partnering with MESMER. We have received your project inquiry on behalf of <b>${inquiry.company}</b>.`,
      nextStep: "Our engineering and commercial team is reviewing your requirements. A dedicated project manager will contact you within <b>24 business hours</b> with an initial consultation or request for clarification.",
      summaryTitle: "Summary of Submitted Information:",
      footerNotice: "If you have urgent inquiries, please contact our international project office at +998 (55) 518 88 70 or info@mesmer.uz.",
    },
    ru: {
      title: "Ваша заявка принята в обработку",
      greeting: `Уважаемый(ая) ${inquiry.name},`,
      body: `Благодарим за интерес к сотрудничеству с MESMER. Ваша заявка от имени компании <b>${inquiry.company}</b> успешно зарегистрирована.`,
      nextStep: "Наши инженеры и проектный отдел уже приступили к анализу технических требований. Наш специалист свяжется с вами в течение <b>24 рабочих часов</b> для уточнения деталей и подготовки предложения.",
      summaryTitle: "Параметры вашей заявки:",
      footerNotice: "По срочным вопросам вы можете связаться с нами напрямую по телефону +998 (55) 518 88 70 или почте info@mesmer.uz.",
    },
    uz: {
      title: "Loyihaviy arizangiz qabul qilindi",
      greeting: `Hurmatli ${inquiry.name},`,
      body: `MESMER bilan hamkorlikka qiziqish bildirganingiz uchun tashakkur. <b>${inquiry.company}</b> nomidan yuborilgan murojaatingiz muvaffaqiyatli ro'yxatga olindi.`,
      nextStep: "Muhandislik va loyiha boshqaruvi guruhimiz loyihangiz talablarini o'rganib chiqmoqda. Mutaxassisimiz <b>24 ish soati</b> ichida siz bilan bog'lanadi.",
      summaryTitle: "Yuborilgan ma'lumotlar:",
      footerNotice: "Shoshilinch savollar bo'yicha biz bilan to'g'ridan-to'g'ri bog'lanishingiz mumkin: +998 (55) 518 88 70 yoki info@mesmer.uz.",
    },
  };

  const t = templates[locale] || templates.en;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 20px; background-color: #f8fafc; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #003882; color: #ffffff; padding: 28px 32px; text-align: center; }
          .content { padding: 32px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0; }
          .footer { text-align: center; padding: 24px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em;">MESMER</h1>
            <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 13px;">Water & Wastewater Infrastructure EPC Contractor</p>
          </div>
          <div class="content">
            <h2 style="font-size: 18px; color: #003882; margin-top: 0;">${t.title}</h2>
            <p style="font-size: 15px;">${t.greeting}</p>
            <p style="font-size: 14px; color: #475569;">${t.body}</p>
            <p style="font-size: 14px; color: #475569;">${t.nextStep}</p>

            <div class="box">
              <div style="font-weight: 700; font-size: 13px; color: #003882; margin-bottom: 8px;">${t.summaryTitle}</div>
              <div style="font-size: 13px; color: #334155;"><b>Company:</b> ${inquiry.company}</div>
              <div style="font-size: 13px; color: #334155;"><b>Category:</b> ${(inquiry.inquiryTypes || []).join(", ") || "General"}</div>
              ${inquiry.file ? `<div style="font-size: 13px; color: #334155;"><b>Attachment:</b> ${inquiry.file.originalName}</div>` : ""}
            </div>

            <p style="font-size: 13px; color: #64748b; line-height: 1.5;">${t.footerNotice}</p>
          </div>
          <div class="footer">
            MESMER-EAST LLC • Shiroq street 100, Tashkent, 100069, Uzbekistan<br/>
            <a href="https://www.mesmer.uz" style="color: #003882; text-decoration: none;">www.mesmer.uz</a>
          </div>
        </div>
      </body>
    </html>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"MESMER International" <${process.env.SMTP_FROM || salesEmail}>`,
        to: inquiry.email,
        subject: subjects[locale] || subjects.en,
        html,
      });
      console.log("[Mail] Confirmation email delivered to inquirer:", inquiry.email);
    } catch (err) {
      console.error("[Mail] Failed to send sender confirmation email:", err);
    }
  } else {
    console.log(
      `[Mail Simulation] Confirmation email prepared for inquirer: ${inquiry.email} (${subjects[locale] || subjects.en})`
    );
  }
}
