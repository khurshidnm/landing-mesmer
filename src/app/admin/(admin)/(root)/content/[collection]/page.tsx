"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { FieldEditor } from "@/components/cms/field-editor";
import { getCollection, t, type CmsEntry } from "@/lib/cms/definitions";

type Entry = CmsEntry<Record<string, unknown>>;

const errorText = (error: unknown) =>
  (axios.isAxiosError(error) && error.response?.data?.error) || "Something went wrong.";

function entryLabel(entry: Entry): { title: string; subtitle: string } {
  const en = (v: unknown) => (typeof v === "string" ? v : t(v as Partial<Record<"en", string>>, "en"));
  // SEO rows: show which page they belong to
  if (entry.page) {
    const page = getCollection("seo")?.fields.find((f) => f.name === "page")?.options?.find((o) => o.value === entry.page);
    return { title: page?.label || String(entry.page), subtitle: en(entry.title) };
  }
  const name = en(entry.label) || en(entry.title) || en(entry.name) || "Item";
  const title = entry.value ? `${entry.value} — ${name}` : name;
  const subtitle =
    en(entry.href) || en(entry.description) || en(entry.tagline) || en(entry.full_name) || en(entry.slug);
  return { title, subtitle };
}

export default function ContentCollectionPage() {
  const { collection } = useParams<{ collection: string }>();
  const def = getCollection(collection);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [seeded, setSeeded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<{ id: string | null; values: Record<string, unknown> } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await axios.get(`/api/cms/${collection}?all=1`);
      setEntries(res.data.data.entries);
      setSeeded(res.data.data.seeded);
    } catch (error) {
      toast({ title: "Failed to load", description: errorText(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    load();
  }, [load]);

  // Menu: show dropdown items under their parent
  const rows = useMemo(() => {
    if (!def?.fields.some((f) => f.type === "parent")) return entries.map((e) => ({ entry: e, depth: 0 }));
    const tops = entries.filter((e) => !e.parent);
    return tops.flatMap((top) => [
      { entry: top, depth: 0 },
      ...entries.filter((e) => e.parent === top._id).map((e) => ({ entry: e, depth: 1 })),
    ]);
  }, [entries, def]);

  // Singleton (e.g. Home Hero): open its form as soon as it is loaded
  useEffect(() => {
    if (def?.singleton && seeded && entries[0] && !editing) {
      setEditing({ id: entries[0]._id, values: entries[0] });
    }
  }, [def, seeded, entries, editing]);

  const parentOptions = useMemo(
    () =>
      entries
        .filter((e) => !e.parent && e._id !== editing?.id)
        .map((e) => ({ value: e._id, label: entryLabel(e).title })),
    [entries, editing]
  );

  if (!def) return <p className="p-6 text-sm text-muted-foreground">Unknown content section.</p>;

  const run = async (action: () => Promise<unknown>, success?: string) => {
    setBusy(true);
    try {
      await action();
      if (success) toast({ title: success });
      await load();
      return true;
    } catch (error) {
      toast({ title: "Error", description: errorText(error), variant: "destructive" });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!editing) return;
    const body = { data: editing.values };
    const ok = await run(
      () =>
        editing.id ? axios.put(`/api/cms/${collection}/${editing.id}`, body) : axios.post(`/api/cms/${collection}`, body),
      "Saved"
    );
    if (ok && !def.singleton) setEditing(null);
  };

  const toggle = (entry: Entry) =>
    run(() => axios.put(`/api/cms/${collection}/${entry._id}`, { enabled: !entry.enabled }));

  const remove = (entry: Entry) => {
    const children = entries.filter((e) => e.parent === entry._id).length;
    const note = children ? ` Its ${children} dropdown item(s) will be deleted too.` : "";
    if (!confirm(`Delete “${entryLabel(entry).title}”?${note}`)) return;
    run(() => axios.delete(`/api/cms/${collection}/${entry._id}`), "Deleted");
  };

  // Move among items with the same parent
  const move = (entry: Entry, direction: -1 | 1) => {
    const siblings = entries.filter((e) => (e.parent || "") === (entry.parent || ""));
    const index = siblings.findIndex((e) => e._id === entry._id);
    const other = siblings[index + direction];
    if (!other) return;
    const order = entries.map((e) => e._id);
    const a = order.indexOf(entry._id);
    const b = order.indexOf(other._id);
    [order[a], order[b]] = [order[b], order[a]];
    run(() => axios.post(`/api/cms/${collection}/reorder`, { ids: order }));
  };

  const form = editing && (
    <div className="space-y-5">
      {def.fields.map((field) => (
        <div key={field.name} className="space-y-5">
          {field.section && (
            <h2 className="border-b pb-2 pt-4 text-base font-bold text-gray-900 first:pt-0">{field.section}</h2>
          )}
          <FieldEditor
            field={field}
            values={editing.values}
            parentOptions={parentOptions}
            setValue={(name, value) =>
              setEditing((prev) => prev && { ...prev, values: { ...prev.values, [name]: value } })
            }
          />
        </div>
      ))}
    </div>
  );


  // Singleton (e.g. Home Hero): edit the one entry directly
  if (def.singleton) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{def.title}</h1>
          <p className="text-sm text-muted-foreground">{def.description}</p>
        </div>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        ) : (
          <div className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
            {form}
            <Button onClick={save} disabled={busy} className="w-full">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{def.title}</h1>
          <p className="text-sm text-muted-foreground">{def.description}</p>
        </div>
        {seeded && (
          <Button onClick={() => setEditing({ id: null, values: {} })} disabled={busy}>
            <Plus className="mr-2 h-4 w-4" /> Add item
          </Button>
        )}
      </div>

      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      ) : (
        <div className="divide-y overflow-hidden rounded-2xl border bg-white shadow-sm">
          {rows.length === 0 && <p className="p-6 text-sm text-muted-foreground">No items yet.</p>}
          {rows.map(({ entry, depth }) => {
            const { title, subtitle } = entryLabel(entry);
            return (
              <div
                key={entry._id}
                className={`flex items-center gap-3 px-4 py-3 ${depth ? "bg-gray-50/60 pl-10" : ""} ${
                  entry.enabled ? "" : "opacity-50"
                }`}
              >
                {typeof entry.logo === "string" && entry.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={entry.logo} alt="" className="h-10 w-16 shrink-0 rounded border bg-white object-contain p-1" />
                )}
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm ${depth ? "font-medium" : "font-semibold"} text-gray-900`}>
                    {depth ? "↳ " : ""}
                    {title}
                    {!entry.enabled && <span className="ml-2 text-xs font-normal text-gray-500">(hidden)</span>}
                  </p>
                  {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
                </div>
                {seeded && (
                  <div className="flex shrink-0 items-center gap-1">
                    <Button variant="ghost" size="icon" title="Move up" disabled={busy} onClick={() => move(entry, -1)}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Move down" disabled={busy} onClick={() => move(entry, 1)}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title={entry.enabled ? "Hide on website" : "Show on website"}
                      disabled={busy}
                      onClick={() => toggle(entry)}
                    >
                      {entry.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit"
                      disabled={busy}
                      onClick={() => setEditing({ id: entry._id, values: entry })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      disabled={busy}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => remove(entry)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit item" : "Add item"}</DialogTitle>
          </DialogHeader>
          {form}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={save} disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
