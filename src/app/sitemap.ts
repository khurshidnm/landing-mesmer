import type { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/mongoose";
import Projects from "@/database/projects.model";
import News from "@/database/news.model";
import Constants from "@/database/consts.model";
import { getEntries } from "@/lib/cms/server";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.mesmer.uz";
  const locales = ["en", "ru", "uz"] as const;

  const staticRoutes = [
    { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
    { path: "/services", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/projects", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/career", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/news", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/expertise", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/group", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/start-a-project", changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  // Expertise and group company pages come from Website Content
  try {
    const [expertise, companies] = await Promise.all([getEntries("expertise"), getEntries("group_companies")]);
    for (const item of expertise) {
      if (item.slug) staticRoutes.push({ path: `/expertise/${item.slug}`, changeFrequency: "monthly" as const, priority: 0.8 });
    }
    for (const company of companies) {
      if (company.slug && !company.page_href) {
        staticRoutes.push({ path: `/group/${company.slug}`, changeFrequency: "monthly" as const, priority: 0.6 });
      }
    }
  } catch (error) {
    console.error("Failed to add content pages to sitemap:", error);
  }

  const entries: MetadataRoute.Sitemap = [];

  // Generate static pages for each locale with hreflang alternates
  for (const route of staticRoutes) {
    for (const locale of locales) {
      const localizedUrl = `${baseUrl}/${locale}${route.path}`;
      const languageAlternates: Record<string, string> = {
        en: `${baseUrl}/en${route.path}`,
        ru: `${baseUrl}/ru${route.path}`,
        uz: `${baseUrl}/uz${route.path}`,
        "x-default": `${baseUrl}/en${route.path}`,
      };

      entries.push({
        url: localizedUrl,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: languageAlternates,
        },
      });
    }
  }

  // Fetch dynamic content from MongoDB
  try {
    await connectToDatabase();

    const [projects, newsList] = await Promise.all([
      Projects.find({}, "slug updatedAt createdAt").lean().exec(),
      News.find({}, "slug updatedAt createdAt").lean().exec(),
    ]);

    // Dynamic project pages
    for (const project of projects || []) {
      if (!project.slug) continue;
      const lastModified = project.updatedAt || project.createdAt || new Date();

      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/projects/${project.slug}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.85,
          alternates: {
            languages: {
              en: `${baseUrl}/en/projects/${project.slug}`,
              ru: `${baseUrl}/ru/projects/${project.slug}`,
              uz: `${baseUrl}/uz/projects/${project.slug}`,
              "x-default": `${baseUrl}/en/projects/${project.slug}`,
            },
          },
        });
      }
    }

    // Dynamic news pages
    for (const item of newsList || []) {
      if (!item.slug) continue;
      const lastModified = item.updatedAt || item.createdAt || new Date();

      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/news/${item.slug}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.75,
          alternates: {
            languages: {
              en: `${baseUrl}/en/news/${item.slug}`,
              ru: `${baseUrl}/ru/news/${item.slug}`,
              uz: `${baseUrl}/uz/news/${item.slug}`,
              "x-default": `${baseUrl}/en/news/${item.slug}`,
            },
          },
        });
      }
    }
  } catch (error) {
    console.error("Failed to generate dynamic sitemap entries:", error);
  }

  // Company Profile PDF Document (uploaded via admin Settings, falls back to the bundled file)
  let profilePdf = "/MESMER%20RULES.pdf";
  try {
    const constants = await Constants.findOne({}).lean<{ profile_pdf?: string }>();
    if (constants?.profile_pdf) profilePdf = constants.profile_pdf;
  } catch (error) {
    console.error("Failed to load company profile PDF for sitemap:", error);
  }
  entries.push({
    url: `${baseUrl}${profilePdf}`,
    lastModified: new Date("2025-02-20"),
    changeFrequency: "monthly",
    priority: 0.6,
  });

  return entries;
}
