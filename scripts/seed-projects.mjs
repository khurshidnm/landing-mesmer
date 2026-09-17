import mongoose from "mongoose";
import fs from "fs";
import path from "path";

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mesmer";
  console.log("Connecting to MongoDB at:", MONGODB_URI);

  await mongoose.connect(MONGODB_URI, {
    dbName: "mesmer-admin",
  });

  console.log("Connected to MongoDB!");

  let allProjects = [];
  try {
    const res = await fetch("https://mesmer.uz/api/projects?page=1&limit=10");
    const json = await res.json();
    allProjects = json.data?.projects || [];
  } catch (e) {
    console.error("Failed to fetch from live API:", e.message);
  }

  console.log(`Found ${allProjects.length} total projects in fetched data.`);

  // Pick 6 projects (e.g. the 6 latest projects)
  // Let's sort or pick the last 6 (projects 26-31) or first 6:
  // In the live API, projects 26-31 are the most recent (Project 31 was created in Sept 2026, 30 in April 2026, etc.)
  const selectedProjects = allProjects.slice(-6).reverse();

  console.log(`\nSeeding ${selectedProjects.length} projects into mesmer-admin.projects collection:\n`);

  const db = mongoose.connection.db;
  const collection = db.collection("projects");

  for (const project of selectedProjects) {
    const { _id, uz, en, ru, slug, cover, gallery, createdAt, updatedAt } = project;

    const document = {
      uz: {
        title: uz?.title || "",
        main_title: uz?.main_title || uz?.title || "",
        description: uz?.description || "",
        volume_of_tasks: uz?.volume_of_tasks || "",
        customer: uz?.customer || "",
        status: uz?.status || "Ongoing",
        implementation_period: uz?.implementation_period || "",
      },
      en: {
        title: en?.title || "",
        main_title: en?.main_title || en?.title || "",
        description: en?.description || "",
        volume_of_tasks: en?.volume_of_tasks || "",
        customer: en?.customer || "",
        status: en?.status || "Ongoing",
        implementation_period: en?.implementation_period || "",
      },
      ru: {
        title: ru?.title || "",
        main_title: ru?.main_title || ru?.title || "",
        description: ru?.description || "",
        volume_of_tasks: ru?.volume_of_tasks || "",
        customer: ru?.customer || "",
        status: ru?.status || "Ongoing",
        implementation_period: ru?.implementation_period || "",
      },
      slug: slug,
      cover: cover,
      gallery: gallery || [],
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
    };

    const result = await collection.updateOne(
      { slug },
      { $set: document },
      { upsert: true }
    );

    console.log(`✓ [${result.upsertedCount > 0 ? "INSERTED" : "UPDATED"}] ${en.title} (slug: ${slug})`);
  }

  const count = await collection.countDocuments();
  console.log(`\nTotal projects in local db now: ${count}`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB. Done!");
}

main().catch((err) => {
  console.error("Error seeding projects:", err);
  process.exit(1);
});
