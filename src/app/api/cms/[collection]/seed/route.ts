import { revalidatePath } from "next/cache";
import { json, requireAdmin, resolveCollection } from "@/lib/cms/api";
import { seedCollection } from "@/lib/cms/server";

// Loads the built-in default content into the database so it can be edited.
export async function POST(_: Request, { params }: { params: Promise<{ collection: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { def, error } = await resolveCollection(params);
  if (error) return error;

  const created = await seedCollection(def.key);
  revalidatePath("/", "layout");
  return json({ success: true, data: { created } });
}
