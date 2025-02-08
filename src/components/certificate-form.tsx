"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Certificate } from "@/types/certificates";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface CertificateFormProps {
  certificate?: Certificate;
  onSubmit: (data: Partial<Certificate>) => void;
}

export function CertificateForm({
  certificate,
  onSubmit,
}: CertificateFormProps) {
  const router = useRouter();
  const [titles, setTitles] = useState({
    uz: certificate?.uz.title || "",
    en: certificate?.en.title || "",
    ru: certificate?.ru.title || "",
  });
  const [image, setImage] = useState<string | null>(certificate?.image || null);

  const handleTitleChange = (lang: "uz" | "en" | "ru", value: string) => {
    setTitles((prev) => ({ ...prev, [lang]: value }));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post("/api/upload", formData);
        if (res.data.success) {
          setImage("/api/uploads/" + res.data.name);
        } else {
          toast({
            title: "Rasm yuklashda xatolik yuz berdi.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Rasm yuklashda xatolik yuz berdi.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      uz: { title: titles.uz },
      en: { title: titles.en },
      ru: { title: titles.ru },
      image: image?.includes("/api/uploads/") ? image : "/api/uploads/" + image,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title-uz">Title (Uzbek)</Label>
          <Input
            id="title-uz"
            value={titles.uz}
            onChange={(e) => handleTitleChange("uz", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="title-en">Title (English)</Label>
          <Input
            id="title-en"
            value={titles.en}
            onChange={(e) => handleTitleChange("en", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="title-ru">Title (Russian)</Label>
          <Input
            id="title-ru"
            value={titles.ru}
            onChange={(e) => handleTitleChange("ru", e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required={!certificate}
        />
      </div>
      {image &&   "/api/uploads/" + image && (
            <div className="aspect-square relative overflow-hidden rounded-md w-48">
              <Image
                src={
                  (image?.includes("/api/uploads/")
                    ? image
                    : "/api/uploads/" + image) || "/placeholder.svg"
                }
                alt="Certificate preview"
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/certificates")}
        >
          Cancel
        </Button>
        <Button type="submit">
          {certificate ? "Update" : "Create"} Certificate
        </Button>
      </div>
    </form>
  );
}
