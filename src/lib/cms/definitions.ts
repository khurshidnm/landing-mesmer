// Content blocks that admins edit in "Website Content" (menu, hero, numbers,
// expertise, financiers, group companies). Shared by the admin editor, the
// API (validation) and the public pages. No server-only imports here.

export const LOCALES = ["uz", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export type I18nText = Record<Locale, string>;
export type I18nList = Record<Locale, string[]>;

export type FieldType =
  | "text"
  | "textarea"
  | "i18n"
  | "i18n-textarea"
  | "i18n-list"
  | "image"
  | "select"
  | "boolean"
  | "parent";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  /** Starts a new titled group in the admin form */
  section?: string;
}

export interface CollectionDef {
  key: CollectionKey;
  title: string;
  description: string;
  singleton?: boolean;
  /** Field used as a unique URL identifier within the collection */
  slugField?: string;
  fields: FieldDef[];
}

/** Project categories (spec 4.5). Also used to link expertise to projects. */
export const PROJECT_CATEGORIES = [
  { value: "water-treatment", en: "Water Treatment", ru: "Водоподготовка", uz: "Suv tozalash" },
  { value: "wastewater", en: "Wastewater", ru: "Водоотведение и очистка стоков", uz: "Oqova suv" },
  { value: "water-supply", en: "Water Supply", ru: "Водоснабжение", uz: "Suv ta’minoti" },
  { value: "irrigation", en: "Irrigation", ru: "Ирригация", uz: "Irrigatsiya" },
  // Not in the spec's list: covers the road projects in the portfolio
  { value: "infrastructure", en: "Roads & Infrastructure", ru: "Дороги и инфраструктура", uz: "Yo‘llar va infratuzilma" },
] as const;

export const CONTRACT_TYPES = [
  { value: "epc", en: "EPC", ru: "EPC", uz: "EPC" },
  { value: "design", en: "Design", ru: "Проектирование", uz: "Loyihalash" },
  { value: "supply", en: "Supply", ru: "Поставка", uz: "Yetkazib berish" },
  { value: "om", en: "O&M", ru: "Эксплуатация (O&M)", uz: "Ekspluatatsiya (O&M)" },
] as const;

export const PROJECT_STATUSES = [
  { value: "completed", en: "Completed", ru: "Завершён", uz: "Tamomlangan" },
  { value: "ongoing", en: "Ongoing", ru: "В работе", uz: "Jarayonda" },
  { value: "commissioning", en: "Commissioning", ru: "Ввод в эксплуатацию", uz: "Ishga tushirish" },
] as const;

export const VACANCY_CATEGORIES = [
  { value: "engineering", en: "Engineering", ru: "Инжиниринг", uz: "Muhandislik" },
  { value: "project-management", en: "Project Management", ru: "Управление проектами", uz: "Loyihalarni boshqarish" },
  { value: "om", en: "O&M", ru: "Эксплуатация (O&M)", uz: "Ekspluatatsiya (O&M)" },
  { value: "other", en: "Other", ru: "Другое", uz: "Boshqa" },
] as const;

export type Option = { value: string; en: string; ru: string; uz: string };

export function optionLabel(list: readonly Option[], value: string | undefined, locale: string) {
  const found = list.find((o) => o.value === value);
  if (!found) return value || "";
  return found[(locale as Locale) in found ? (locale as Locale) : "en"];
}

const categoryOptions = [
  { value: "", label: "— None —" },
  ...PROJECT_CATEGORIES.map((c) => ({ value: c.value, label: c.en })),
];

export const COLLECTIONS = {
  menu: {
    key: "menu",
    title: "Menu",
    description:
      "Top navigation. Items without a parent are top-level; items with a parent appear in its dropdown.",
    fields: [
      { name: "label", label: "Label", type: "i18n", required: true },
      {
        name: "href",
        label: "Link",
        type: "text",
        required: true,
        help: "Path without the language, e.g. /projects?category=wastewater or /about#certificates. Full https:// links open as-is.",
      },
      { name: "parent", label: "Parent item", type: "parent", help: "Leave empty for a top-level item." },
    ],
  },
  hero: {
    key: "hero",
    title: "Home Hero",
    description: "First screen of the home page.",
    singleton: true,
    fields: [
      { name: "brand", label: "Brand name", type: "text" },
      { name: "tagline", label: "Tagline (under the brand)", type: "i18n" },
      { name: "title", label: "Headline", type: "i18n-textarea", required: true },
      { name: "subtitle", label: "Short description", type: "i18n-textarea" },
      { name: "primary_label", label: "Primary button text", type: "i18n" },
      { name: "primary_href", label: "Primary button link", type: "text" },
      { name: "secondary_label", label: "Secondary button text", type: "i18n" },
      { name: "secondary_href", label: "Secondary button link", type: "text" },
      { name: "background", label: "Background image", type: "image", help: "Wide landscape photo, at least 1920px wide." },
    ],
  },
  stats: {
    key: "stats",
    title: "Key Numbers",
    description:
      "Shown in the “MESMER in Numbers” block. Items marked “Show in hero” also appear in the strip under the home hero.",
    fields: [
      { name: "value", label: "Value", type: "text", required: true, help: "e.g. 20+, 1.5M+, 2,000+ km, 500,000+ m³/day" },
      { name: "label", label: "Short label (hero strip)", type: "i18n", required: true },
      { name: "description", label: "Description (numbers block)", type: "i18n" },
      { name: "show_in_hero", label: "Show in hero strip", type: "boolean" },
    ],
  },
  expertise: {
    key: "expertise",
    title: "Expertise",
    description: "Core expertise areas. Each has its own page at /expertise/<slug>.",
    slugField: "slug",
    fields: [
      { name: "slug", label: "URL slug", type: "text", required: true, help: "Lowercase, e.g. water-treatment" },
      { name: "title", label: "Title", type: "i18n", required: true },
      { name: "summary", label: "Summary", type: "i18n-textarea" },
      { name: "services", label: "Services (one per line)", type: "i18n-list" },
      { name: "image", label: "Image", type: "image" },
      {
        name: "project_category",
        label: "Related project category",
        type: "select",
        options: categoryOptions,
        help: "Projects of this category are listed on the expertise page.",
      },
      { name: "featured", label: "Show on home page", type: "boolean" },
    ],
  },
  financiers: {
    key: "financiers",
    title: "Financiers",
    description:
      "International financial institutions. Used for project filters and the “Internationally Financed Projects” block.",
    slugField: "slug",
    fields: [
      { name: "slug", label: "Filter key", type: "text", required: true, help: "Lowercase, e.g. adb. Used in /projects?financier=adb" },
      { name: "name", label: "Short name", type: "text", required: true, help: "e.g. ADB" },
      { name: "full_name", label: "Full name (also used as logo alt text)", type: "i18n", required: true },
      { name: "logo", label: "Logo (SVG/PNG, transparent background)", type: "image" },
    ],
  },
  group_companies: {
    key: "group_companies",
    title: "MESMER Group",
    description: "Companies of the group. Each has its own page at /group/<slug>.",
    slugField: "slug",
    fields: [
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "name", label: "Company name", type: "text", required: true },
      { name: "tagline", label: "Short description (card)", type: "i18n" },
      {
        name: "description",
        label: "About the company",
        type: "i18n-textarea",
        help: "Leave an empty line between paragraphs.",
      },
      { name: "facts", label: "Key facts (one per line)", type: "i18n-list" },
      { name: "logo", label: "Logo", type: "image" },
      { name: "website", label: "Website", type: "text", help: "e.g. https://mesal.uz — shown on the card and the company page." },
      { name: "address", label: "Address", type: "i18n" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "text" },
      {
        name: "page_href",
        label: "Internal page (optional)",
        type: "text",
        help: "e.g. /about. The card opens this page instead of /group/<slug>.",
      },
    ],
  },
  home_content: {
    key: "home_content",
    title: "Home Page Texts",
    description: "Texts and photos of the home page sections below the hero.",
    singleton: true,
    fields: [
      { name: "partners_title", label: "Title", type: "i18n", section: "Partners strip" },
      { name: "about_title", label: "Title", type: "i18n", section: "About Us block" },
      { name: "about_subtitle", label: "Subtitle", type: "i18n" },
      { name: "about_description", label: "Text", type: "i18n-textarea" },
      { name: "about_image_1", label: "Photo 1", type: "image" },
      { name: "about_image_2", label: "Photo 2", type: "image" },
      { name: "about_image_3", label: "Photo 3", type: "image" },
      { name: "mission_title", label: "Mission title", type: "i18n" },
      { name: "mission_description", label: "Mission text", type: "i18n-textarea" },
      { name: "advantages_title", label: "Title", type: "i18n", section: "Advantages (certificates) block" },
      { name: "advantages_subtitle", label: "Subtitle", type: "i18n" },
      { name: "advantages_description", label: "Text", type: "i18n-textarea" },
      { name: "goals_title", label: "Title", type: "i18n", section: "Sustainable development goals block" },
      { name: "goals_description", label: "Text", type: "i18n-textarea" },
      { name: "projects_title", label: "Title", type: "i18n", section: "Projects block" },
      { name: "projects_subtitle", label: "Lead text", type: "i18n-textarea" },
      { name: "projects_image", label: "Photo", type: "image" },
      { name: "projects_description", label: "Text", type: "i18n-textarea" },
      { name: "projects_button", label: "Button text", type: "i18n" },
    ],
  },
  about_page: {
    key: "about_page",
    title: "About Page",
    description: "Texts and photos of the About Us page.",
    singleton: true,
    fields: [
      { name: "hero_title", label: "Page title", type: "i18n", section: "Top of page" },
      { name: "hero_image", label: "Background photo", type: "image" },
      { name: "intro_title", label: "Title", type: "i18n", section: "About us briefly" },
      { name: "intro_image", label: "Photo", type: "image" },
      { name: "intro_text", label: "Text", type: "i18n-textarea" },
      { name: "wide_image_1", label: "Full-width photo", type: "image" },
      { name: "goals_title", label: "Title", type: "i18n", section: "Goals and objectives" },
      { name: "goals_image", label: "Photo", type: "image" },
      { name: "goals_text", label: "Text", type: "i18n-textarea" },
      { name: "competition_title", label: "Title", type: "i18n", section: "Fair competition" },
      { name: "competition_text", label: "Text", type: "i18n-textarea" },
      { name: "wide_image_2", label: "Full-width photo", type: "image" },
      { name: "ethics_title", label: "Title", type: "i18n", section: "Suppliers, partners and clients" },
      { name: "ethics_text", label: "Text", type: "i18n-textarea" },
      { name: "quality_title", label: "Title", type: "i18n", section: "Quality control" },
      { name: "quality_text", label: "Text", type: "i18n-textarea" },
      { name: "quality_points", label: "Bullet points (one per line)", type: "i18n-list" },
      { name: "quality_footer", label: "Closing text", type: "i18n-textarea" },
      { name: "partners_title", label: "Title", type: "i18n", section: "Partners" },
      { name: "partners_text", label: "Text", type: "i18n-textarea", help: "Logos are managed in Website Content → Partners." },
    ],
  },
  partners: {
    key: "partners",
    title: "Partners",
    description: "Partner logos: the scrolling strip on the home page and the logo grid on the About page.",
    fields: [
      { name: "name", label: "Partner name (logo alt text)", type: "text", required: true },
      { name: "logo", label: "Logo", type: "image", required: true },
      { name: "show_on_home", label: "Show in the home page strip", type: "boolean" },
      { name: "show_on_about", label: "Show on the About page", type: "boolean" },
    ],
  },
  seo: {
    key: "seo",
    title: "SEO",
    description:
      "Search engine title and description for each page. The Services page SEO is in Site Settings; news and project pages have their own SEO fields.",
    slugField: "page",
    fields: [
      {
        name: "page",
        label: "Page",
        type: "select",
        required: true,
        options: [
          { value: "home", label: "Home" },
          { value: "about", label: "About Us" },
          { value: "projects", label: "Projects" },
          { value: "expertise", label: "Expertise" },
          { value: "group", label: "MESMER Group" },
          { value: "news", label: "News" },
          { value: "career", label: "Careers" },
          { value: "contact", label: "Contact" },
          { value: "start-a-project", label: "Start a Project" },
        ],
      },
      { name: "title", label: "Title (up to ~60 characters)", type: "i18n-textarea", required: true },
      { name: "description", label: "Description (up to ~160 characters)", type: "i18n-textarea" },
    ],
  },
  site_texts: {
    key: "site_texts",
    title: "Footer & Contact",
    description: "Footer tagline, Contact page texts and the project inquiry form headings.",
    singleton: true,
    fields: [
      { name: "footer_tagline", label: "Tagline under the logo", type: "i18n-textarea", section: "Footer" },
      { name: "contact_title", label: "Page title", type: "i18n", section: "Contact page" },
      { name: "contact_eyebrow", label: "Small heading", type: "i18n" },
      { name: "contact_company", label: "Company name", type: "i18n" },
      { name: "contact_intro", label: "Company description", type: "i18n-textarea" },
      { name: "contact_standards_title", label: "Standards card title", type: "i18n" },
      { name: "contact_standards_text", label: "Standards card text", type: "i18n" },
      { name: "form_eyebrow", label: "Small heading", type: "i18n", section: "Project inquiry form (Contact and Start a Project pages)" },
      { name: "form_title", label: "Title", type: "i18n" },
      { name: "form_subtitle", label: "Text", type: "i18n-textarea" },
      { name: "form_success_title", label: "Success message title", type: "i18n" },
      { name: "form_success_text", label: "Success message text", type: "i18n-textarea" },
    ],
  },
} satisfies Record<string, Omit<CollectionDef, "key"> & { key: string }>;

export type CollectionKey = keyof typeof COLLECTIONS;

export function getCollection(key: string): CollectionDef | undefined {
  return (COLLECTIONS as Record<string, CollectionDef>)[key];
}

/** Entry as returned to pages: data fields flattened next to meta fields. */
export type CmsEntry<T = Record<string, unknown>> = T & {
  _id: string;
  sort_order: number;
  enabled: boolean;
};

export function t(value: Partial<I18nText> | undefined, locale: string): string {
  if (!value) return "";
  return value[locale as Locale] || value.en || value.ru || value.uz || "";
}

export function tList(value: Partial<I18nList> | undefined, locale: string): string[] {
  if (!value) return [];
  const list = value[locale as Locale];
  return list && list.length ? list : value.en || value.ru || value.uz || [];
}

/** Turns a stored link into a URL for the current language. */
export function localizeHref(href: string | undefined, locale: string): string {
  if (!href) return `/${locale}`;
  if (/^(https?:|mailto:|tel:)/.test(href)) return href;
  if (href.startsWith("#")) return href;
  if (/^\/(uz|ru|en)(\/|$|\?|#)/.test(href)) return href;
  return `/${locale}${href === "/" ? "" : href}`;
}

export function isSafeHref(href: string): boolean {
  const value = href.trim().toLowerCase();
  return (
    value === "" ||
    value.startsWith("/") ||
    value.startsWith("#") ||
    value.startsWith("https://") ||
    value.startsWith("http://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  );
}
