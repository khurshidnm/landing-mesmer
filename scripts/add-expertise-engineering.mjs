// One-off update for the expertise pages: adds the separate "Engineering &
// Design" page (/expertise/engineering), points the "Engineering" menu item to
// it and renames the old "Engineering & EPC" page to "EPC & O&M".
// Safe to run more than once; admin edits are kept.
//
//   node --env-file=.env.local scripts/add-expertise-engineering.mjs

import mongoose from "mongoose";

await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mesmer-admin", {
  dbName: "mesmer-admin",
});
const entries = mongoose.connection.collection("cmsentries");
const seeded = (key) => entries.findOne({ collection_key: "_meta", "data.key": key });

if (await seeded("expertise")) {
  if (await entries.findOne({ collection_key: "expertise", "data.slug": "engineering" })) {
    console.log("Engineering page already exists");
  } else {
    const epc = await entries.findOne({ collection_key: "expertise", "data.slug": "engineering-epc" });
    const order = epc?.sort_order ?? 99;
    await entries.updateMany({ collection_key: "expertise", sort_order: { $gte: order } }, { $inc: { sort_order: 1 } });
    // Only the slug is stored: the rest of the page comes from the built-in content until edited
    await entries.insertOne({
      collection_key: "expertise",
      sort_order: order,
      enabled: true,
      data: { slug: "engineering" },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Added the Engineering & Design page");
  }
  const renamed = await entries.updateOne(
    { collection_key: "expertise", "data.slug": "engineering-epc", "data.title.en": "Engineering & EPC" },
    { $set: { "data.title": { en: "EPC & O&M", ru: "EPC и эксплуатация", uz: "EPC va ekspluatatsiya" } } }
  );
  if (renamed.modifiedCount) console.log("Renamed Engineering & EPC → EPC & O&M");
}

if (await seeded("menu")) {
  const menu = await entries.updateOne(
    { collection_key: "menu", "data.href": "/expertise/engineering-epc", "data.label.en": "Engineering" },
    { $set: { "data.href": "/expertise/engineering" } }
  );
  if (menu.modifiedCount) console.log("Menu: Engineering → /expertise/engineering");
}

await mongoose.disconnect();
