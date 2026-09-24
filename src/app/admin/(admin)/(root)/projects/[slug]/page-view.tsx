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
import { ImageGallery } from "@/components/imageGallery";
import {
  PROJECT_STAGES,
  getSelectedStageValue,
  getStageTranslations,
} from "@/lib/project-status";
import {
  EMPTY_PROJECT_DATABASE,
  ProjectDatabaseFields,
  projectDatabaseValues,
  type ProjectDatabaseValues,
} from "@/components/project-database-fields";

interface LanguageContent {
  title: string;
  main_title: string;
  description: string;
  volume_of_tasks: string;
  customer: string;
  status: string;
  implementation_period: string;
  meta_title?: string;
  meta_description?: string;
}

export default function ProjectsPage({
  project,
}: {
  project: {
    uz: LanguageContent;
    en: LanguageContent;
    ru: LanguageContent;
    cover: string;
    gallery: string[];
    slug: string;
    project_type?: string;
  } & Parameters<typeof projectDatabaseValues>[0];
}) {
  const [uz, setUz] = useState<LanguageContent>({
    title: "",
    main_title: "",
    description: "",
    volume_of_tasks: "",
    customer: "",
    status: "",
    implementation_period: "",
    meta_title: "",
    meta_description: "",
  });
  const [en, setEn] = useState<LanguageContent>({
    title: "",
    main_title: "",
    description: "",
    volume_of_tasks: "",
    customer: "",
    status: "",
    implementation_period: "",
    meta_title: "",
    meta_description: "",
  });
  const [ru, setRu] = useState<LanguageContent>({
    title: "",
    main_title: "",
    description: "",
    volume_of_tasks: "",
    customer: "",
    status: "",
    implementation_period: "",
    meta_title: "",
    meta_description: "",
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [projectDb, setProjectDb] = useState<ProjectDatabaseValues>(projectDatabaseValues(project));

  useEffect(() => {
    setUz({ ...project.uz, meta_title: project.uz?.meta_title || "", meta_description: project.uz?.meta_description || "" });
    setEn({ ...project.en, meta_title: project.en?.meta_title || "", meta_description: project.en?.meta_description || "" });
    setRu({ ...project.ru, meta_title: project.ru?.meta_title || "", meta_description: project.ru?.meta_description || "" });
    setCoverImageUrl(project.cover);
    setGalleryImages(project.gallery);
    setSlug(project.slug);
    setProjectDb(projectDatabaseValues(project));
  }, [project]);

  const router = useRouter();

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
    if (!projectDb.category) {
      toast({
        title: "Validation Error",
        description: "Please select a project Category before saving.",
        variant: "destructive",
      });
      return;
    }
    if (!en.status) {
      toast({
        title: "Validation Error",
        description: "Please select a Project Stage / Status before saving.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.put("/api/projects/" + project.slug, {
        title_uz: uz.title,
        title_en: en.title,
        title_ru: ru.title,
        description_uz: uz.description,
        description_en: en.description,
        description_ru: ru.description,
        volume_of_tasks_uz: uz.volume_of_tasks,
        volume_of_tasks_en: en.volume_of_tasks,
        volume_of_tasks_ru: ru.volume_of_tasks,
        customer_uz: uz.customer,
        customer_en: en.customer,
        customer_ru: ru.customer,
        status_uz: uz.status,
        status_en: en.status,
        status_ru: ru.status,
        implementation_period_uz: uz.implementation_period,
        implementation_period_en: en.implementation_period,
        implementation_period_ru: ru.implementation_period,
        main_title_uz: uz.main_title,
        main_title_en: en.main_title,
        main_title_ru: ru.main_title,
        meta_title_uz: uz.meta_title,
        meta_title_en: en.meta_title,
        meta_title_ru: ru.meta_title,
        meta_description_uz: uz.meta_description,
        meta_description_en: en.meta_description,
        meta_description_ru: ru.meta_description,
        slug,
        cover: coverImageUrl.includes("/api/uploads/") ? coverImageUrl : "/api/uploads/" + coverImageUrl,
        gallery: galleryImages,
        ...projectDb,
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Project created successfully",
          variant: "default",
        });
        router.push("/admin/projects");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (lang: "uz" | "en" | "ru", value: string) => {
    const newTitle = value;
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, title: newTitle }));
      setSlug(generateSlug(newTitle));
    } else if (lang === "en") {
      setEn((prev) => ({ ...prev, title: newTitle }));
    } else {
      setRu((prev) => ({ ...prev, title: newTitle }));
    }
  };
  const handleMainTitleChange = (lang: "uz" | "en" | "ru", value: string) => {
    const newMainTitle = value;
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, main_title: newMainTitle }));
      setSlug(generateSlug(newMainTitle));
    } else if (lang === "en") {
      setEn((prev) => ({ ...prev, main_title: newMainTitle }));
    } else {
      setRu((prev) => ({ ...prev, main_title: newMainTitle }));
    }
  };

  const handleVolumeOfTasksChange = (
    lang: "uz" | "en" | "ru",
    value: string
  ) => {
    const newVolumeOfTasks = value;
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, volume_of_tasks: newVolumeOfTasks }));
    } else if (lang === "en") {
      setEn((prev) => ({ ...prev, volume_of_tasks: newVolumeOfTasks }));
    } else {
      setRu((prev) => ({ ...prev, volume_of_tasks: newVolumeOfTasks }));
    }
  };

  const handleCustomerChange = (lang: "uz" | "en" | "ru", value: string) => {
    const newCustomer = value;
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, customer: newCustomer }));
    } else if (lang === "en") {
      setEn((prev) => ({ ...prev, customer: newCustomer }));
    } else {
      setRu((prev) => ({ ...prev, customer: newCustomer }));
    }
  };

  const handleStageSelect = (selectedValue: string) => {
    const translations = getStageTranslations(selectedValue);
    setUz((prev) => ({ ...prev, status: translations.uz }));
    setEn((prev) => ({ ...prev, status: translations.en }));
    setRu((prev) => ({ ...prev, status: translations.ru }));
  };

  const handleImplementationPeriodChange = (
    lang: "uz" | "en" | "ru",
    value: string
  ) => {
    const newImplementationPeriod = value;
    if (lang === "uz") {
      setUz((prev) => ({
        ...prev,
        implementation_period: newImplementationPeriod,
      }));
    } else if (lang === "en") {
      setEn((prev) => ({
        ...prev,
        implementation_period: newImplementationPeriod,
      }));
    } else {
      setRu((prev) => ({
        ...prev,
        implementation_period: newImplementationPeriod,
      }));
    }
  };

  const handleMetaTitleChange = (lang: "uz" | "en" | "ru", value: string) => {
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, meta_title: value }));
    } else if (lang === "en") {
      setEn((prev) => ({ ...prev, meta_title: value }));
    } else {
      setRu((prev) => ({ ...prev, meta_title: value }));
    }
  };

  const handleMetaDescriptionChange = (lang: "uz" | "en" | "ru", value: string) => {
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, meta_description: value }));
    } else if (lang === "en") {
      setEn((prev) => ({ ...prev, meta_description: value }));
    } else {
      setRu((prev) => ({ ...prev, meta_description: value }));
    }
  };

  const renderLanguageTab = (
    lang: "uz" | "en" | "ru",
    content: LanguageContent,
    setContent: React.Dispatch<React.SetStateAction<LanguageContent>>
  ) => (
    <TabsContent value={lang}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`title-${lang}`}>Title ({lang.toUpperCase()})</Label>
          <Input
            id={`title-${lang}`}
            placeholder={`Enter project title in ${lang.toUpperCase()}`}
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.title}
            onChange={(e) => handleTitleChange(lang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`main_title-${lang}`}>
            Main title ({lang.toUpperCase()})
          </Label>
          <Input
            id={`main_title-${lang}`}
            placeholder={`Enter project title in ${lang.toUpperCase()}`}
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.main_title}
            onChange={(e) => handleMainTitleChange(lang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`volume_of_tasks-${lang}`}>
            Volume of tasks ({lang.toUpperCase()})
          </Label>
          <Input
            id={`volume_of_tasks-${lang}`}
            placeholder={`Enter project volume of tasks in ${lang.toUpperCase()}`}
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.volume_of_tasks}
            onChange={(e) => handleVolumeOfTasksChange(lang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`customer-${lang}`}>
            Customer ({lang.toUpperCase()})
          </Label>
          <Input
            id={`customer-${lang}`}
            placeholder={`Enter customer in ${lang.toUpperCase()}`}
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.customer}
            onChange={(e) => handleCustomerChange(lang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`status-${lang}`}>
            {lang === "en"
              ? "Project Stage / Status"
              : lang === "uz"
              ? "Loyiha bosqichi (Status)"
              : "Этап проекта (Статус)"}
          </Label>
          <select
            id={`status-${lang}`}
            disabled={isLoading}
            className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            value={getSelectedStageValue(content.status)}
            onChange={(e) => handleStageSelect(e.target.value)}
          >
            <option value="" disabled>
              {lang === "en"
                ? "-- Select Project Stage --"
                : lang === "uz"
                ? "-- Loyiha bosqichini tanlang --"
                : "-- Выберите этап проекта --"}
            </option>
            {PROJECT_STAGES.map((stage) => (
              <option key={stage.value} value={stage.value}>
                {lang === "en"
                  ? stage.labelEn
                  : lang === "uz"
                  ? stage.labelUz
                  : stage.labelRu}
              </option>
            ))}
            {content.status &&
              !PROJECT_STAGES.some(
                (s) => s.value === getSelectedStageValue(content.status)
              ) && (
                <option value={content.status}>{content.status} (Custom)</option>
              )}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`implementation_period-${lang}`}>
            Implementation period ({lang.toUpperCase()})
          </Label>
          <Input
            id={`implementation_period-${lang}`}
            placeholder={`Enter implementation period in ${lang.toUpperCase()}`}
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.implementation_period}
            onChange={(e) =>
              handleImplementationPeriodChange(lang, e.target.value)
            }
          />
        </div>
        <div className="p-4 border rounded-lg bg-blue-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor={`meta_title-${lang}`} className="font-semibold text-blue-950">
              SEO Meta Title ({lang.toUpperCase()})
            </Label>
            <span className="text-xs text-muted-foreground">
              {(content.meta_title || "").length}/60 chars (e.g. WWTP EPC Central Asia | ...)
            </span>
          </div>
          <Input
            id={`meta_title-${lang}`}
            placeholder={`e.g. WWTP EPC Central Asia | ${content.title || "Project Name"} | MESMER`}
            disabled={isLoading}
            value={content.meta_title || ""}
            onChange={(e) => handleMetaTitleChange(lang, e.target.value)}
          />
          <div className="flex items-center justify-between pt-1">
            <Label htmlFor={`meta_description-${lang}`} className="font-semibold text-blue-950">
              SEO Meta Description ({lang.toUpperCase()})
            </Label>
            <span className="text-xs text-muted-foreground">
              {(content.meta_description || "").length}/160 chars
            </span>
          </div>
          <Input
            id={`meta_description-${lang}`}
            placeholder="Key project highlights, EPC contractor role, capacity and region"
            disabled={isLoading}
            value={content.meta_description || ""}
            onChange={(e) => handleMetaDescriptionChange(lang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`content-${lang}`}>
            Description ({lang.toUpperCase()})
          </Label>
          <RichTextEditor
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.description}
            setValue={(value) =>
              setContent((prev) => ({ ...prev, description: value }))
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
          <CardTitle>Create project</CardTitle>
          <CardDescription>Add a new project to your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="uz">
            <TabsList>
              <TabsTrigger value="uz">Uzbek</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ru">Russian</TabsTrigger>
            </TabsList>
            {renderLanguageTab("uz", uz, setUz)}
            {renderLanguageTab("en", en, setEn)}
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
          <ProjectDatabaseFields values={projectDb} onChange={setProjectDb} disabled={isLoading} />
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
          <div className="space-y-2">
            <Label htmlFor="gallery">Gallery Images</Label>
            <ImageGallery images={galleryImages} setImages={setGalleryImages} />
          </div>
          <div className="flex gap-4">
            <Button
              className={cn("flex-1", isLoading && "animate-pulse")}
              disabled={isLoading}
              onClick={handlePublish}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {(uz.title || uz.description || coverImage) && (
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
              <div dangerouslySetInnerHTML={{ __html: uz.description }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
