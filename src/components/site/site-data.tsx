"use client";

import { createContext, useContext } from "react";
import type { CmsEntry, I18nText } from "@/lib/cms/definitions";
import type { SiteTexts } from "@/lib/cms/content-types";

export type MenuEntry = CmsEntry<{ label: I18nText; href: string; parent?: string }>;

type SiteData = { menu: MenuEntry[]; texts?: SiteTexts };

const SiteDataContext = createContext<SiteData>({ menu: [] });

/** Data loaded once per request in the locale layout: the menu and the footer/contact texts. */
export function SiteDataProvider({ value, children }: { value: SiteData; children: React.ReactNode }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export const useSiteData = () => useContext(SiteDataContext);
