"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSlug } from "@/lib/generate-slug";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { NewsItem } from "@/types/news";

interface LanguageContent {
  title: string;
  description: string;
  content: string;
}

export default function NewsEditPageInner({ news }: { news: NewsItem }) {
  const [uz, setUz] = useState<LanguageContent>({
    title: "",
    description: "",
    content: "",
  });
  const [oz, setOz] = useState<LanguageContent>({
    title: "",
    description: "",
    content: "",
  });
  const [ru, setRu] = useState<LanguageContent>({
    title: "",
    description: "",
    content: "",
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setUz({
      title: news.uz.title,
      description: news.uz.description,
      content: news.uz.content,
    });
    setOz({
      title: news.oz.title,
      description: news.oz.description,
      content: news.oz.content,
    });
    setRu({
      title: news.ru.title,
      description: news.ru.description,
      content: news.ru.content,
    });
    setCoverImageUrl(news.cover);
    const coverImage = fetch(news.cover)
      .then((res) => res.blob())
      .then((blob) => setCoverImage(new File([blob], "cover.png", { type: "image/png" })))
      .catch(() => null);
    setSlug(news.slug);
  }, [news]);

  const handleCoverImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setCoverImage(file);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data.success) {
          setCoverImageUrl(response.data.name);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload cover image",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "You must select a cover image",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/news", {
        title_uz: uz.title,
        title_oz: oz.title,
        title_ru: ru.title,
        description_uz: uz.description,
        description_oz: oz.description,
        description_ru: ru.description,
        content_uz: uz.content,
        content_oz: oz.content,
        content_ru: ru.content,
        slug,
        cover: "/api/uploads/" + coverImageUrl,
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "News article created successfully",
          variant: "default",
        });
        router.push("/admin/news");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create news article",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (lang: "uz" | "oz" | "ru", value: string) => {
    const newTitle = value;
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, title: newTitle }));
      setSlug(generateSlug(newTitle));
    } else if (lang === "oz") {
      setOz((prev) => ({ ...prev, title: newTitle }));
    } else {
      setRu((prev) => ({ ...prev, title: newTitle }));
    }
  };

  const renderLanguageTab = (
    lang: "uz" | "oz" | "ru",
    content: LanguageContent,
    setContent: React.Dispatch<React.SetStateAction<LanguageContent>>
  ) => (
    <TabsContent value={lang}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`title-${lang}`}>Title ({lang.toUpperCase()})</Label>
          <Input
            id={`title-${lang}`}
            placeholder={`Enter news title in ${lang.toUpperCase()}`}
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.title}
            onChange={(e) => handleTitleChange(lang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`description-${lang}`}>
            Description ({lang.toUpperCase()})
          </Label>
          <Input
            id={`description-${lang}`}
            placeholder={`Enter news description in ${lang.toUpperCase()}`}
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.description}
            onChange={(e) =>
              setContent((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`content-${lang}`}>
            Content ({lang.toUpperCase()})
          </Label>
          <RichTextEditor
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.content}
            setValue={(value) =>
              setContent((prev) => ({ ...prev, content: value }))
            }
          />
        </div>
      </div>
    </TabsContent>
  );

  return (
    <div
      className={cn(
        "container mx-auto",
        isLoading && "animate-pulse [animation-duration:1.5s]"
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Create News Article</CardTitle>
          <CardDescription>
            Add a new news article to your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="uz">
            <TabsList>
              <TabsTrigger value="uz">Uzbek</TabsTrigger>
              <TabsTrigger value="oz">Uzbek Cyrillic</TabsTrigger>
              <TabsTrigger value="ru">Russian</TabsTrigger>
            </TabsList>
            {renderLanguageTab("uz", uz, setUz)}
            {renderLanguageTab("oz", oz, setOz)}
            {renderLanguageTab("ru", ru, setRu)}
          </Tabs>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              disabled={isLoading}
              className={isLoading ? "animate-pulse" : ""}
              value={slug}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image</Label>
            <Input
              id="cover"
              type="file"
              accept="image/*"
              disabled={isLoading}
              className={isLoading ? "animate-pulse" : ""}
              onChange={handleCoverImageChange}
            />
            {coverImage && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(coverImage) || "/placeholder.svg"}
                  alt="Cover preview"
                  className="max-h-48 rounded-lg object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button
              className={cn("flex-1", isLoading && "animate-pulse")}
              disabled={isLoading}
              onClick={handlePublish}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {(uz.title || uz.content || coverImage) && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Preview (Uzbek)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h1>{uz.title}</h1>
              {coverImage && (
                <img
                  src={URL.createObjectURL(coverImage) || "/placeholder.svg"}
                  alt="Cover"
                  className="w-full rounded-lg object-cover my-4"
                />
              )}
              <div dangerouslySetInnerHTML={{ __html: uz.content }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
