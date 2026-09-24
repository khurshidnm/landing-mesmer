import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { getCollection, type CollectionDef } from "./definitions";

export const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status });

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session ? null : json({ success: false, error: "You are not authenticated" }, 401);
}

export async function resolveCollection(params: Promise<{ collection: string }>) {
  const { collection } = await params;
  const def = getCollection(collection);
  return def
    ? { def: def as CollectionDef, error: null }
    : { def: null, error: json({ success: false, error: "Unknown collection" }, 404) };
}
