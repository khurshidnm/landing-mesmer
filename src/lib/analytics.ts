declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    ym?: (counterId: number, command: string, ...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = "G-5NRZXYKKXW";
export const YM_COUNTER_ID = 100012016;

/**
 * Universal tracking function sending custom events to GA4 and Yandex Metrika
 */
export function trackEvent(
  eventName: string,
  params: Record<string, any> = {}
) {
  if (typeof window === "undefined") return;

  try {
    // Google Analytics 4
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }

    // Yandex Metrika goal
    if (typeof window.ym === "function") {
      window.ym(YM_COUNTER_ID, "reachGoal", eventName, params);
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics] Tracked event: "${eventName}"`, params);
    }
  } catch (err) {
    console.error("Failed to track analytics event:", err);
  }
}

/**
 * Goal tracker: Form Submission (Contact, Start a Project, Vacancies)
 */
export function trackFormSubmit(
  formName: string,
  extraData: Record<string, any> = {}
) {
  trackEvent("form_submission", {
    event_category: "Engagement",
    event_label: formName,
    form_name: formName,
    ...extraData,
  });
}

/**
 * Goal tracker: Document / Company Profile Download
 */
export function trackDownload(
  fileName: string,
  extraData: Record<string, any> = {}
) {
  trackEvent("file_download", {
    event_category: "Downloads",
    event_label: fileName,
    file_name: fileName,
    ...extraData,
  });
}

/**
 * Goal tracker: Direct Contact Click (Phone, Email, LinkedIn)
 */
export function trackContactClick(
  channel: "phone" | "email" | "linkedin",
  value: string
) {
  trackEvent("contact_click", {
    event_category: "Lead Generation",
    event_label: `${channel}: ${value}`,
    contact_channel: channel,
    contact_value: value,
  });
}

/**
 * Goal tracker: Open "Start a Project" Modal
 */
export function trackStartProjectOpen() {
  trackEvent("start_project_modal_open", {
    event_category: "CTA",
    event_label: "Start a Project Modal Opened",
  });
}
