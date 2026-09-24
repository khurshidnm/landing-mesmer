import { revalidatePath } from "next/cache";
import CmsEntryModel from "@/database/cms-entry.model";
import { connectToDatabase } from "@/lib/mongoose";
import { json, requireAdmin, resolveCollection } from "@/lib/cms/api";
import { getEntries, isSeeded, markSeeded, sanitizeData, seedCollection } from "@/lib/cms/server";

type Params = { params: Promise<{ collection: string }> };

// Public: enabled entries. Admin (?all=1): every entry, editable.
export async function GET(req: Request, { params }: Params) {
  const { def, error } = await resolveCollection(params);
  if (error) return error;

  const all = new URL(req.url).searchParams.get("all") === "1";
  if (all) {
    const denied = await requireAdmin();
    if (denied) return denied;
    // First visit in the admin panel: copy the built-in content into the
    // database so every item can be edited right away
    if (!(await isSeeded(def.key))) await seedCollection(def.key);
  }
  const entries = await getEntries(def.key, { includeDisabled: all });
  return json({ success: true, data: { entries, seeded: await isSeeded(def.key) } });
}

export async function POST(req: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { def, error } = await resolveCollection(params);
  if (error) return error;

  await connectToDatabase();
  const body = await req.json().catch(() => ({}));
  const { data, error: invalid } = sanitizeData(def, body.data || {});
  if (invalid) return json({ success: false, error: invalid }, 400);

  if (def.singleton && (await CmsEntryModel.exists({ collection_key: def.key }))) {
    return json({ success: false, error: "This block already exists; edit it instead." }, 400);
  }
  if (def.slugField) {
    const taken = await CmsEntryModel.exists({
      collection_key: def.key,
      [`data.${def.slugField}`]: data[def.slugField],
    });
    if (taken) return json({ success: false, error: "This slug is already used." }, 400);
  }
  if (data.parent) {
    const parent = await CmsEntryModel.findOne({ _id: data.parent, collection_key: def.key }).lean<{ data?: { parent?: string } }>();
    if (!parent || parent.data?.parent) {
      return json({ success: false, error: "Parent must be a top-level item." }, 400);
    }
  }

  const last = await CmsEntryModel.findOne({ collection_key: def.key }).sort({ sort_order: -1 }).lean<{ sort_order?: number }>();
  const entry = await CmsEntryModel.create({
    collection_key: def.key,
    sort_order: (last?.sort_order ?? -1) + 1,
    enabled: body.enabled !== false,
    data,
  });
  // From now on the site uses the database, not the built-in defaults
  await markSeeded(def.key);
  revalidatePath("/", "layout");
  return json({ success: true, data: { id: String(entry._id) } });
}
