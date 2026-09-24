import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import CmsEntryModel from "@/database/cms-entry.model";
import { connectToDatabase } from "@/lib/mongoose";
import { json, requireAdmin, resolveCollection } from "@/lib/cms/api";
import { sanitizeData } from "@/lib/cms/server";

type Params = { params: Promise<{ collection: string; id: string }> };

async function load(params: Params["params"]) {
  const denied = await requireAdmin();
  if (denied) return { denied };
  const { collection, id } = await params;
  const { def, error } = await resolveCollection(Promise.resolve({ collection }));
  if (error) return { denied: error };
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { denied: json({ success: false, error: "Not found" }, 404) };
  }
  await connectToDatabase();
  const entry = await CmsEntryModel.findOne({ _id: id, collection_key: def.key });
  if (!entry) return { denied: json({ success: false, error: "Not found" }, 404) };
  return { def, entry, id };
}

export async function PUT(req: Request, { params }: Params) {
  const { denied, def, entry, id } = await load(params);
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  if (body.data !== undefined) {
    const { data, error } = sanitizeData(def, body.data);
    if (error) return json({ success: false, error }, 400);

    if (def.slugField) {
      const taken = await CmsEntryModel.exists({
        collection_key: def.key,
        _id: { $ne: id },
        [`data.${def.slugField}`]: data[def.slugField],
      });
      if (taken) return json({ success: false, error: "This slug is already used." }, 400);
    }
    if (data.parent) {
      const hasChildren = await CmsEntryModel.exists({ collection_key: def.key, "data.parent": id });
      const parent = await CmsEntryModel.findOne({ _id: data.parent, collection_key: def.key }).lean<{ data?: { parent?: string } }>();
      if (data.parent === id || hasChildren || !parent || parent.data?.parent) {
        return json({ success: false, error: "Only a top-level item without sub-items can be moved under a parent." }, 400);
      }
    }
    entry.data = data;
    entry.markModified("data");
  }
  if (typeof body.enabled === "boolean") entry.enabled = body.enabled;
  await entry.save();
  revalidatePath("/", "layout");
  return json({ success: true });
}

export async function DELETE(_: Request, { params }: Params) {
  const { denied, def, id } = await load(params);
  if (denied) return denied;

  await CmsEntryModel.deleteOne({ _id: id });
  // Removing a menu item also removes its dropdown items
  const children = await CmsEntryModel.deleteMany({ collection_key: def.key, "data.parent": id });
  revalidatePath("/", "layout");
  return json({ success: true, data: { removedChildren: children.deletedCount } });
}
