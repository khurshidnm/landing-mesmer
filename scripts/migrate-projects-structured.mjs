// One-off migration for the project database (spec 4.5): fills the new
// structured fields (category, financier, contract type, capacity, status,
// dates, country, city) from each project's existing text.
//
// Only empty fields are filled, so edits made in the admin panel are kept.
// Review the printed table afterwards and correct anything in the admin panel.
//
//   node --env-file=.env.local scripts/migrate-projects-structured.mjs --dry-run
//   node --env-file=.env.local scripts/migrate-projects-structured.mjs

import mongoose from "mongoose";

const DRY_RUN = process.argv.includes("--dry-run");

const strip = (html = "") =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

// Place names that appear in project titles: [en, ru, uz]
const PLACES = [
  ["Bukhara", "Бухара", "Buxoro"],
  ["Samarkand", "Самарканд", "Samarqand"],
  ["Kattakurgan", "Каттакурган", "Kattaqo‘rg‘on"],
  ["Dustlik", "Дустлик", "Do‘stlik"],
  ["Sardoba", "Сардоба", "Sardoba"],
  ["Shakhrisabz", "Шахрисабз", "Shahrisabz"],
  ["Pitnak", "Питнак", "Pitnak"],
  ["Karshi", "Карши", "Qarshi"],
  ["Beruniy", "Беруни", "Beruniy"],
  ["Gulistan", "Гулистан", "Guliston"],
  ["Karakul", "Каракуль", "Qorako‘l"],
  ["Chinaz", "Чиназ", "Chinoz"],
  ["Zangiota", "Зангиата", "Zangiota"],
  ["Karmana", "Кармана", "Karmana"],
  ["Nukus", "Нукус", "Nukus"],
  ["Urgench", "Ургенч", "Urganch"],
  ["Khiva", "Хива", "Xiva"],
  ["Navoi", "Навои", "Navoiy"],
  ["Jizzakh", "Джизак", "Jizzax"],
  ["Termez", "Термез", "Termiz"],
  ["Fergana", "Фергана", "Farg‘ona"],
  ["Andijan", "Андижан", "Andijon"],
  ["Namangan", "Наманган", "Namangan"],
  ["Kokand", "Коканд", "Qo‘qon"],
  ["Chirchik", "Чирчик", "Chirchiq"],
  ["Keles", "Келес", "Keles"],
  ["Bishkek", "Бишкек", "Bishkek"],
  ["Osh", "Ош", "O‘sh"],
  ["Tashkent", "Ташкент", "Toshkent"],
];

const FINANCIERS = [
  ["adb", /asian development bank|\badb\b/i],
  ["ebrd", /european bank for reconstruction|\bebrd\b/i],
  ["world-bank", /world bank|\bida\b/i],
  ["afd", /agence fran[cç]aise|french development agency|\bafd\b/i],
  ["isdb", /islamic development bank|\bisdb\b/i],
  ["adfd", /abu dhabi fund|\badfd\b/i],
];

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function parseDate(part) {
  const year = part.match(/(19|20)\d{2}/)?.[0];
  if (!year) return "";
  const month = MONTHS.findIndex((m) => part.toLowerCase().includes(m));
  return month >= 0 ? `${year}-${String(month + 1).padStart(2, "0")}` : year;
}

function derive(p) {
  const en = p.en || {};
  const title = `${en.title || ""} ${en.main_title || ""}`;
  const body = strip(`${en.volume_of_tasks || ""} ${en.description || ""}`);
  const all = `${title} ${body} ${en.customer || ""}`;
  const out = { uz: {}, ru: {}, en: {} };

  // Category: title first, then scope of work, then the old "project type"
  const categorize = (text) => {
    if (/\broad\b|bypass|highway/i.test(text)) return "infrastructure";
    if (/wwtp|wastewater|sewer|sewage|force main|канализ|сточн/i.test(text)) return "wastewater";
    if (/\bwtp\b|water treatment|водоочист|водоподготов/i.test(text)) return "water-treatment";
    if (/canal|irrigat|drainage|RI[D]?NDS/i.test(text)) return "irrigation";
    if (/water supply|transmission main|trunk main|water network|conduit|pumping|water intake|distribution|водоснабж/i.test(text))
      return "water-supply";
    return "";
  };
  out.category =
    categorize(title) ||
    categorize(body) ||
    { wwtp: "wastewater", wtp: "water-treatment" }[p.project_type] ||
    "";

  // Financier: descriptions say "Financed by …"
  const financedBy = all.match(/financed by ([^|]+)/i)?.[1] || "";
  out.financier =
    FINANCIERS.find(([, re]) => re.test(financedBy))?.[0] ||
    FINANCIERS.find(([, re]) => re.test(all))?.[0] ||
    { adb: "adb", ebrd: "ebrd" }[p.project_type] ||
    "";

  if (/\(epc\)|\bepc\b|design,? supply and installation|design and build/i.test(all)) out.contract_type = "epc";

  // Capacity: largest "N m3/day" in the text
  const capacities = [...all.matchAll(/(\d[\d\s,.]*\d|\d)\s*(?:m3|m³|м3|м³)\s*\/\s*(?:day|d\b|сут)/gi)]
    .map((m) => Number(m[1].replace(/[\s,]/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (capacities.length) out.capacity_value = Math.max(...capacities);

  const population = all.match(/(\d[\d\s,.]*)\s*(thousand|million)?\s*(?:people|inhabitants|residents)/i);
  if (population) {
    const n = Number(population[1].replace(/[\s,]/g, ""));
    const factor = /million/i.test(population[2] || "") ? 1e6 : /thousand/i.test(population[2] || "") ? 1e3 : 1;
    if (Number.isFinite(n)) out.population_served = Math.round(n * factor);
  }

  const status = (en.status || "").toLowerCase();
  out.stage = /finish|complet/.test(status) ? "completed" : /commis/.test(status) ? "commissioning" : /ongoing/.test(status) ? "ongoing" : "";

  const [from = "", to = ""] = (en.implementation_period || "").split(/\s[-–—]\s|-(?=\s*[A-Za-z]*\s*\d{4})/);
  out.start_date = parseDate(from);
  out.end_date = /now|present|current/i.test(to) ? "" : parseDate(to);

  out.country = /kyrgyz/i.test(all) ? "KG" : /kazakh/i.test(all) ? "KZ" : /tajik/i.test(all) ? "TJ" : "UZ";

  // The place named first in the title (e.g. "… in Kattakurgan Town of Samarkand Region" → Kattakurgan)
  const firstPlace = (text) =>
    PLACES.map((place) => ({ place, at: text.search(new RegExp(`\\b${place[0]}\\b`, "i")) }))
      .filter((m) => m.at >= 0)
      .sort((a, b) => a.at - b.at)[0]?.place;
  // Routes ("road between A, B and C") name endpoints, not the site: leave the city empty
  const place = /\bbetween\b/i.test(title) ? undefined : firstPlace(title) || firstPlace(body);
  if (place) [out.en.city, out.ru.city, out.uz.city] = place;

  return out;
}

const isEmpty = (v) => v === undefined || v === null || v === "";

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mesmer-admin", {
    dbName: "mesmer-admin",
  });
  const projects = mongoose.connection.collection("projects");
  const all = await projects.find({}).sort({ createdAt: 1 }).toArray();
  let changed = 0;

  console.log(DRY_RUN ? "DRY RUN — nothing is saved\n" : "");
  for (const p of all) {
    const d = derive(p);
    const set = {};
    for (const key of ["category", "financier", "contract_type", "stage", "start_date", "end_date", "capacity_value", "population_served"]) {
      if (isEmpty(p[key]) && !isEmpty(d[key])) set[key] = d[key];
    }
    // Country defaults to UZ in the schema, so only replace it when another country is detected
    if ((isEmpty(p.country) || p.country === "UZ") && d.country !== "UZ") set.country = d.country;
    if (isEmpty(p.country) && d.country === "UZ") set.country = "UZ";
    if (isEmpty(p.capacity_unit)) set.capacity_unit = "m³/day";
    for (const lang of ["uz", "ru", "en"]) {
      if (isEmpty(p[lang]?.city) && d[lang].city) set[`${lang}.city`] = d[lang].city;
    }

    const view = { ...p, ...Object.fromEntries(Object.entries(set).filter(([k]) => !k.includes("."))) };
    console.log(
      [
        (view.category || "?").padEnd(15),
        (view.financier || "-").padEnd(10),
        (view.contract_type || "-").padEnd(4),
        (view.stage || "?").padEnd(13),
        `${view.start_date || "?"}→${view.end_date || "now"}`.padEnd(16),
        String(view.capacity_value ?? "").padEnd(7),
        (view.country || "").padEnd(3),
        (set["en.city"] || p.en?.city || "").padEnd(12),
        (p.en?.title || "").slice(0, 60),
      ].join(" | ")
    );

    if (Object.keys(set).length) {
      changed++;
      if (!DRY_RUN) await projects.updateOne({ _id: p._id }, { $set: set });
    }
  }
  console.log(`\n${all.length} projects, ${changed} ${DRY_RUN ? "would be" : ""} updated.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
