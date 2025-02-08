"use client"

import type React from "react"
import { useState } from "react"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateSlug } from "@/lib/generate-slug"
import { cn } from "@/lib/utils"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ImageGallery } from "@/components/imageGallery"

interface LanguageContent {
  title: string
  main_title: string;
  description: string
  volume_of_tasks: string
  customer: string
  status: string
  implementation_period: string
}

export default function ProjectsPage() {
  const [uz, setUz] = useState<LanguageContent>({
    title: "",
    main_title: "",
    description: "",
    volume_of_tasks: "",
    customer: "",
    status: "",
    implementation_period: "",
  })
  const [en, setEn] = useState<LanguageContent>({
    title: "",
    main_title: "",
    description: "",
    volume_of_tasks: "",
    customer: "",
    status: "",
    implementation_period: "",
  })
  const [ru, setRu] = useState<LanguageContent>({
    title: "",
    main_title: "",
    description: "",
    volume_of_tasks: "",
    customer: "",
    status: "",
    implementation_period: "",
  })
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [slug, setSlug] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [galleryImages, setGalleryImages] = useState<string[]>([])

  const router = useRouter()

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      setCoverImage(file)
      try {
        const formData = new FormData()
        formData.append("file", file)
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        if (response.data.success) {
          setCoverImageUrl(response.data.name)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload cover image",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Error",
        description: "You must select a cover image",
        variant: "destructive",
      })
    }
  }

  const handlePublish = async () => {
    setIsLoading(true)

    try {
      const response = await axios.post("/api/projects", {
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
        slug,
        cover: coverImageUrl.includes("/api/uploads/") ? coverImageUrl : "/api/uploads/" + coverImageUrl,
        gallery: galleryImages,
      })

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Project created successfully",
          variant: "default",
        })
        router.push("/admin/projects")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTitleChange = (lang: "uz" | "en" | "ru", value: string) => {
    const newTitle = value
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, title: newTitle }))
      setSlug(generateSlug(newTitle))
    } else if (lang === "en") {
      setEn((prev) => ({ ...prev, title: newTitle }))
    } else {
      setRu((prev) => ({ ...prev, title: newTitle }))
    }
  }
  const handleMainTitleChange = (lang: "uz" | "en" | "ru", value: string) => {
    const newMainTitle = value
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, main_title: newMainTitle }))
      setSlug(generateSlug(newMainTitle))
    } else if (lang === "en") {
      setEn((prev) => ({ ...prev, main_title: newMainTitle }))
    } else {
      setRu((prev) => ({ ...prev, main_title: newMainTitle }))
    }
  }

  const handleVolumeOfTasksChange = (lang: "uz" | "en" | "ru", value: string) => {
    const newVolumeOfTasks = value
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, volume_of_tasks: newVolumeOfTasks }))
    } else if (lang === "en") {
      setEn((prev) => ({ ...prev, volume_of_tasks: newVolumeOfTasks }))
    } else {
      setRu((prev) => ({ ...prev, volume_of_tasks: newVolumeOfTasks }))
    }
  }

  const handleCustomerChange = (lang: "uz" | "en" | "ru", value: string) => {
    const newCustomer = value
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, customer: newCustomer }))
    } else if (lang === "en") {
      setEn((prev) => ({ ...prev, customer: newCustomer }))
    } else {
      setRu((prev) => ({ ...prev, customer: newCustomer }))
    }
  }

  const handleStatusChange = (lang: "uz" | "en" | "ru", value: string) => {
    const newStatus = value
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, status: newStatus }))
    } else if (lang === "en") {
      setEn((prev) => ({ ...prev, status: newStatus }))
    } else {
      setRu((prev) => ({ ...prev, status: newStatus }))
    }
  }

  const handleImplementationPeriodChange = (lang: "uz" | "en" | "ru", value: string) => {
    const newImplementationPeriod = value
    if (lang === "uz") {
      setUz((prev) => ({ ...prev, implementation_period: newImplementationPeriod }))
    } else if (lang === "en") {
      setEn((prev) => ({ ...prev, implementation_period: newImplementationPeriod }))
    } else {
      setRu((prev) => ({ ...prev, implementation_period: newImplementationPeriod }))
    }
  }

  const renderLanguageTab = (
    lang: "uz" | "en" | "ru",
    content: LanguageContent,
    setContent: React.Dispatch<React.SetStateAction<LanguageContent>>,
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
          <Label htmlFor={`title-${lang}`}>Main title ({lang.toUpperCase()})</Label>
          <Input
            id={`title-${lang}`}
            placeholder={`Enter project title in ${lang.toUpperCase()}`}
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.main_title}
            onChange={(e) => handleMainTitleChange(lang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`title-${lang}`}>Volume of tasks ({lang.toUpperCase()})</Label>
          <Input
            id={`title-${lang}`}
            placeholder={`Enter project volume of tasks in ${lang.toUpperCase()}`}
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.volume_of_tasks}
            onChange={(e) => handleVolumeOfTasksChange(lang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`title-${lang}`}>Customer ({lang.toUpperCase()})</Label>
          <Input
            id={`title-${lang}`}
            placeholder={`Enter project volume of tasks in ${lang.toUpperCase()}`}
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.customer}
            onChange={(e) => handleCustomerChange(lang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`title-${lang}`}>Status ({lang.toUpperCase()})</Label>
          <Input
            id={`title-${lang}`}
            placeholder={`Enter project volume of tasks in ${lang.toUpperCase()}`}
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.status}
            onChange={(e) => handleStatusChange(lang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`title-${lang}`}>Implementation period ({lang.toUpperCase()})</Label>
          <Input
            id={`title-${lang}`}
            placeholder={`Enter project volume of tasks in ${lang.toUpperCase()}`}
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.implementation_period}
            onChange={(e) => handleImplementationPeriodChange(lang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`content-${lang}`}>Description ({lang.toUpperCase()})</Label>
          <RichTextEditor
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            value={content.description}
            setValue={(value) => setContent((prev) => ({ ...prev, description: value }))}
          />
        </div>
      </div>
    </TabsContent>
  )

  return (
    <div className={cn("container mx-auto", isLoading && "animate-pulse [animation-duration:1.5s]")}>
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
            <Input id="slug" disabled={isLoading} className={isLoading ? "animate-pulse" : ""} value={slug} readOnly />
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
          <div className="space-y-2">
            <Label htmlFor="gallery">Gallery Images</Label>
            <ImageGallery images={galleryImages} setImages={setGalleryImages} />
          </div>
          <div className="flex gap-4">
            <Button className={cn("flex-1", isLoading && "animate-pulse")} disabled={isLoading} onClick={handlePublish}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish
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
  )
}

