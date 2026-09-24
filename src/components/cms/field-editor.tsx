"use client";

import { useState } from "react";
import axios from "axios";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LOCALES, type FieldDef } from "@/lib/cms/definitions";

type Values = Record<string, unknown>;
type I18nValue = Partial<Record<(typeof LOCALES)[number], string>>;
type I18nListValue = Partial<Record<(typeof LOCALES)[number], string[]>>;

const LANG_LABEL = { uz: "UZ", ru: "RU", en: "EN" } as const;

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData);
      if (res.data?.success) onChange("/api/uploads/" + res.data.name);
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          (axios.isAxiosError(error) && error.response?.data?.error) || "Could not upload the image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="relative flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-gray-50">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-contain" />
        ) : (
          <ImagePlus className="h-6 w-6 text-gray-300" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
            {uploading ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.svg"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) upload(file);
              }}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-red-600 hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          )}
        </div>
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="or paste an image path" className="h-8 text-xs" />
      </div>
    </div>
  );
}

export function FieldEditor({
  field,
  values,
  setValue,
  parentOptions = [],
}: {
  field: FieldDef;
  values: Values;
  setValue: (name: string, value: unknown) => void;
  parentOptions?: { value: string; label: string }[];
}) {
  const raw = values[field.name];
  const label = (
    <Label className="text-sm font-semibold text-gray-800">
      {field.label}
      {field.required && <span className="text-red-500"> *</span>}
    </Label>
  );
  const help = field.help && <p className="text-xs text-muted-foreground">{field.help}</p>;

  switch (field.type) {
    case "text":
      return (
        <div className="space-y-1.5">
          {label}
          <Input value={(raw as string) || ""} onChange={(e) => setValue(field.name, e.target.value)} />
          {help}
        </div>
      );
    case "textarea":
      return (
        <div className="space-y-1.5">
          {label}
          <Textarea rows={4} value={(raw as string) || ""} onChange={(e) => setValue(field.name, e.target.value)} />
          {help}
        </div>
      );
    case "i18n":
    case "i18n-textarea": {
      const value = (raw || {}) as I18nValue;
      return (
        <div className="space-y-1.5">
          {label}
          <div className={field.type === "i18n" ? "grid gap-2 md:grid-cols-3" : "grid gap-2"}>
            {LOCALES.map((lang) => (
              <div key={lang} className="relative">
                <span className="pointer-events-none absolute left-2 top-2 rounded bg-gray-100 px-1.5 text-[10px] font-bold text-gray-500">
                  {LANG_LABEL[lang]}
                </span>
                {field.type === "i18n" ? (
                  <Input
                    className="pl-10"
                    value={value[lang] || ""}
                    onChange={(e) => setValue(field.name, { ...value, [lang]: e.target.value })}
                  />
                ) : (
                  <Textarea
                    rows={3}
                    className="pl-10"
                    value={value[lang] || ""}
                    onChange={(e) => setValue(field.name, { ...value, [lang]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          {help}
        </div>
      );
    }
    case "i18n-list": {
      const value = (raw || {}) as I18nListValue;
      return (
        <div className="space-y-1.5">
          {label}
          <div className="grid gap-2 md:grid-cols-3">
            {LOCALES.map((lang) => (
              <div key={lang} className="space-y-1">
                <span className="text-[10px] font-bold text-gray-500">{LANG_LABEL[lang]}</span>
                <Textarea
                  rows={5}
                  value={(value[lang] || []).join("\n")}
                  onChange={(e) =>
                    setValue(field.name, { ...value, [lang]: e.target.value.split("\n") })
                  }
                />
              </div>
            ))}
          </div>
          {help || <p className="text-xs text-muted-foreground">One item per line.</p>}
        </div>
      );
    }
    case "image":
      return (
        <div className="space-y-1.5">
          {label}
          <ImageField value={(raw as string) || ""} onChange={(v) => setValue(field.name, v)} />
          {help}
        </div>
      );
    case "select":
    case "parent": {
      const options = field.type === "parent" ? [{ value: "", label: "— Top level —" }, ...parentOptions] : field.options || [];
      return (
        <div className="space-y-1.5">
          {label}
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={(raw as string) || ""}
            onChange={(e) => setValue(field.name, e.target.value)}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {help}
        </div>
      );
    }
    case "boolean":
      return (
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border bg-gray-50/60 px-3 py-2.5">
          <input
            type="checkbox"
            className="h-4 w-4 accent-blue-600"
            checked={raw === true}
            onChange={(e) => setValue(field.name, e.target.checked)}
          />
          <span className="text-sm font-medium text-gray-800">{field.label}</span>
          {field.help && <span className="text-xs text-muted-foreground">— {field.help}</span>}
        </label>
      );
  }
}
