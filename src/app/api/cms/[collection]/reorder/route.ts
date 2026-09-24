import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import CmsEntryModel from "@/database/cms-entry.model";
import { connectToDatabase } from "@/lib/mongoose";
import { json, requireAdmin, resolveCollection } from "@/lib/cms/api";

// Body: { ids: string[] } in the new order
export async function POST(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { def, error } = await resolveCollection(params);
  if (error) return error;

  const { ids } = await req.json().catch(() => ({ ids: [] }));
  if (!Array.isArray(ids) || !ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
    return json({ success: false, error: "Invalid order" }, 400);
  }
  await connectToDatabase();
  await CmsEntryModel.bulkWrite(
    ids.map((id: string, index: number) => ({
      updateOne: { filter: { _id: id, collection_key: def.key }, update: { $set: { sort_order: index } } },
    }))
  );
  revalidatePath("/", "layout");
  return json({ success: true });
}
