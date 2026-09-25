// Server-side access to Website Content collections.

import CmsEntryModel from "@/database/cms-entry.model";
import { connectToDatabase } from "@/lib/mongoose";
import { CMS_DEFAULTS } from "./defaults";
import {
  COLLECTIONS,
  LOCALES,
  isSafeHref,
  type CmsEntry,
  type CollectionDef,
  type CollectionKey,
} from "./definitions";

const META = "_meta";

type RawEntry = {
  _id: unknown;
  sort_order?: number;
  enabled?: boolean;
  data?: Record<string, unknown>;
};

function toEntry(doc: RawEntry): CmsEntry {
  return {
    ...(doc.data || {}),
    _id: String(doc._id),
    sort_order: doc.sort_order ?? 0,
    enabled: doc.enabled !== false,
  };
}

/** Default entries shaped like database entries (ids are the default keys). */
function defaultEntries(key: CollectionKey): CmsEntry[] {
  return CMS_DEFAULTS[key].map((item, index) => ({
    ...item.data,
    ...(item.parent_key ? { parent: item.parent_key } : {}),
    _id: item.key,
    sort_order: index,
    enabled: item.enabled !== false,
  }));
}

/**
 * Fields added to a collection after an entry was saved are filled from the
 * built-in entry with the same slug, so new page sections show their default
 * content (and the admin form shows it for editing) until someone saves them.
 */
function withDefaultFields(key: CollectionKey, entry: CmsEntry): CmsEntry {
  const slugField = (COLLECTIONS[key] as CollectionDef).slugField;
  if (!slugField) return entry;
  const fallback = CMS_DEFAULTS[key].find((item) => item.data[slugField] === entry[slugField]);
  if (!fallback) return entry;
  const merged: Record<string, unknown> = { ...entry };
  for (const [field, value] of Object.entries(fallback.data)) {
    if (!(field in merged)) merged[field] = value;
  }
  return merged as CmsEntry;
}

export async function isSeeded(key: CollectionKey): Promise<boolean> {
  await connectToDatabase();
  const marker = await CmsEntryModel.exists({ collection_key: META, "data.key": key });
  return Boolean(marker);
}

/**
 * Entries of a collection, sorted. Until the collection has been loaded into
 * the database, the built-in defaults are returned so the site works out of
 * the box.
 */
export async function getEntries<T = Record<string, unknown>>(
  key: CollectionKey,
  { includeDisabled = false } = {}
): Promise<CmsEntry<T>[]> {
  try {
    if (!(await isSeeded(key))) {
      const defaults = defaultEntries(key);
      return (includeDisabled ? defaults : defaults.filter((e) => e.enabled)) as CmsEntry<T>[];
    }
    const docs = await CmsEntryModel.find({
      collection_key: key,
      ...(includeDisabled ? {} : { enabled: true }),
    })
      .sort({ sort_order: 1, createdAt: 1 })
      .lean<RawEntry[]>();
    return docs.map((doc) => withDefaultFields(key, toEntry(doc))) as CmsEntry<T>[];
  } catch (error) {
    console.error(`[cms] Failed to load "${key}", using defaults:`, error);
    return defaultEntries(key).filter((e) => includeDisabled || e.enabled) as CmsEntry<T>[];
  }
}

export async function getSingleton<T = Record<string, unknown>>(key: CollectionKey): Promise<CmsEntry<T>> {
  const [entry] = await getEntries<T>(key, { includeDisabled: true });
  const fallback = defaultEntries(key)[0] as CmsEntry<T>;
  if (!entry) return fallback;
  // Fields added to the section after it was saved come from the defaults
  const merged: Record<string, unknown> = { ...entry };
  for (const [field, value] of Object.entries(fallback)) {
    if (!(field in merged)) merged[field] = value;
  }
  return merged as CmsEntry<T>;
}

/**
 * SEO title/description for a page from Website Content → SEO, in the given
 * language. Empty values fall back to the page's built-in texts.
 */
export async function getSeo(page: string, locale: string, fallback: { title: string; description: string }) {
  const entries = (await getEntries("seo")) as CmsEntry<{
    page: string;
    title?: Record<string, string>;
    description?: Record<string, string>;
  }>[];
  const entry = entries.find((e) => e.page === page);
  const pick = (v?: Record<string, string>) => (v?.[locale] || "").trim();
  return {
    title: pick(entry?.title) || fallback.title,
    description: pick(entry?.description) || fallback.description,
  };
}

/** Loads the default content into the database (once per collection). */
export async function seedCollection(key: CollectionKey): Promise<number> {
  await connectToDatabase();
  if (await isSeeded(key)) return 0;

  const idByKey = new Map<string, string>();
  let created = 0;
  // Parents first so children can reference their real ids
  const items = [...CMS_DEFAULTS[key]].sort((a, b) => Number(!!a.parent_key) - Number(!!b.parent_key));
  for (const item of items) {
    const order = CMS_DEFAULTS[key].indexOf(item);
    const data: Record<string, unknown> = { ...item.data };
    if (item.parent_key) data.parent = idByKey.get(item.parent_key) || "";
    const doc = await CmsEntryModel.create({
      collection_key: key,
      sort_order: order,
      enabled: item.enabled !== false,
      data,
    });
    idByKey.set(item.key, String(doc._id));
    created++;
  }
  await CmsEntryModel.create({ collection_key: META, data: { key } });
  return created;
}

export async function markSeeded(key: CollectionKey) {
  await connectToDatabase();
  if (!(await isSeeded(key))) {
    await CmsEntryModel.create({ collection_key: META, data: { key } });
  }
}

const cleanText = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

/**
 * Keeps only the fields defined for the collection, with the right types.
 * Returns an error message for missing required fields or unsafe links.
 */
export function sanitizeData(
  def: CollectionDef,
  input: Record<string, unknown>
): { data: Record<string, unknown>; error?: string } {
  const data: Record<string, unknown> = {};
  for (const field of def.fields) {
    const raw = input?.[field.name];
    switch (field.type) {
      case "text":
      case "image":
      case "parent":
        data[field.name] = cleanText(raw, 2000);
        break;
      case "textarea":
        data[field.name] = cleanText(raw, 10000);
        break;
      case "i18n":
      case "i18n-textarea": {
        const obj = (raw || {}) as Record<string, unknown>;
        data[field.name] = Object.fromEntries(
          LOCALES.map((l) => [l, cleanText(obj[l], field.type === "i18n" ? 2000 : 10000)])
        );
        break;
      }
      case "i18n-list": {
        const obj = (raw || {}) as Record<string, unknown>;
        data[field.name] = Object.fromEntries(
          LOCALES.map((l) => [
            l,
            (Array.isArray(obj[l]) ? obj[l] : [])
              .map((s: unknown) => cleanText(s, 500))
              .filter(Boolean)
              .slice(0, 50),
          ])
        );
        break;
      }
      case "select": {
        const value = cleanText(raw, 200);
        data[field.name] = field.options?.some((o) => o.value === value) ? value : "";
        break;
      }
      case "boolean":
        data[field.name] = raw === true;
        break;
    }

    if (field.required) {
      const value = data[field.name];
      const missing =
        typeof value === "string"
          ? !value
          : field.type === "i18n" || field.type === "i18n-textarea"
          ? !Object.values(value as Record<string, string>).some(Boolean)
          : false;
      if (missing) return { data, error: `“${field.label}” is required.` };
    }
  }

  for (const field of def.fields) {
    const isLink = field.name === "href" || field.name.endsWith("_href") || field.name === "website";
    if (isLink && typeof data[field.name] === "string" && !isSafeHref(data[field.name] as string)) {
      return { data, error: `“${field.label}” must start with /, # or https://` };
    }
  }

  if (def.slugField) {
    const slug = String(data[def.slugField] || "")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    data[def.slugField] = slug;
  }

  return { data };
}

export { COLLECTIONS };
