import type { CmsEntry, I18nList, I18nText } from "./definitions";

export type HeroContent = CmsEntry<{
  brand?: string;
  tagline?: I18nText;
  title: I18nText;
  subtitle?: I18nText;
  primary_label?: I18nText;
  primary_href?: string;
  secondary_label?: I18nText;
  secondary_href?: string;
  background?: string;
}>;

export type StatEntry = CmsEntry<{
  value: string;
  label: I18nText;
  description?: I18nText;
  show_in_hero?: boolean;
}>;

export type ExpertiseEntry = CmsEntry<{
  slug: string;
  title: I18nText;
  summary?: I18nText;
  services?: I18nList;
  image?: string;
  project_category?: string;
  featured?: boolean;
  hero_image?: string;
  hero_subtitle?: I18nText;
  body?: I18nText;
  highlights?: I18nList;
  services_title?: I18nText;
  process_title?: I18nText;
  process?: I18nList;
  projects_title?: I18nText;
  cta_title?: I18nText;
  cta_text?: I18nText;
  cta_button?: I18nText;
  seo_title?: I18nText;
  seo_description?: I18nText;
}>;

export type FinancierEntry = CmsEntry<{
  slug: string;
  name: string;
  full_name: I18nText;
  logo?: string;
}>;

export type GroupCompanyEntry = CmsEntry<{
  slug: string;
  name: string;
  tagline?: I18nText;
  description?: I18nText;
  facts?: I18nList;
  logo?: string;
  website?: string;
  address?: I18nText;
  phone?: string;
  email?: string;
  page_href?: string;
}>;

type T = I18nText;
export type HomeContent = CmsEntry<{
  partners_title?: T;
  about_title?: T;
  about_subtitle?: T;
  about_description?: T;
  about_image_1?: string;
  about_image_2?: string;
  about_image_3?: string;
  mission_title?: T;
  mission_description?: T;
  advantages_title?: T;
  advantages_subtitle?: T;
  advantages_description?: T;
  goals_title?: T;
  goals_description?: T;
  projects_title?: T;
  projects_subtitle?: T;
  projects_image?: string;
  projects_description?: T;
  projects_button?: T;
}>;

export type AboutContent = CmsEntry<{
  hero_title?: T;
  hero_image?: string;
  intro_title?: T;
  intro_image?: string;
  intro_text?: T;
  wide_image_1?: string;
  goals_title?: T;
  goals_image?: string;
  goals_text?: T;
  competition_title?: T;
  competition_text?: T;
  wide_image_2?: string;
  ethics_title?: T;
  ethics_text?: T;
  quality_title?: T;
  quality_text?: T;
  quality_points?: I18nList;
  quality_footer?: T;
  partners_title?: T;
  partners_text?: T;
}>;

export type PartnerEntry = CmsEntry<{ name: string; logo: string; show_on_home?: boolean; show_on_about?: boolean }>;

export type SiteTexts = CmsEntry<{
  footer_tagline?: T;
  contact_title?: T;
  contact_eyebrow?: T;
  contact_company?: T;
  contact_intro?: T;
  contact_standards_title?: T;
  contact_standards_text?: T;
  form_eyebrow?: T;
  form_title?: T;
  form_subtitle?: T;
  form_success_title?: T;
  form_success_text?: T;
}>;

/** Plain JSON copy so server data can be passed to client components. */
export const serialize = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
