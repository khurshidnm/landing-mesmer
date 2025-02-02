"use client"

import type React from "react"
import { useState } from "react"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateSlug } from "@/lib/generate-slug"
import { cn } from "@/lib/utils"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewsPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [slug, setSlug] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      setCoverImage(file)
      try {
        const formData = new FormData()
        formData.append("file", file)
        console.log(formData.get("file"))
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        if (response.data.success) {
          setCoverImageUrl(response.data.name)
        }
      } catch (error) {
        toast({
          title: "Error",
          // @ts-expect-error: error is not defined
          description: error.message || "Failed to upload cover image",
          variant: "destructive"
        })
      }
    } else {
      toast({
        title: "Error",
        description: "You must select a cover image",
        variant: "destructive"
      })
    }
  }

  const handlePublish = async () => {
    setIsLoading(true)

    try {
      const response = await axios.post("/api/news", {
        title,
        description: content,
        slug,
        cover: "/uploads/" + coverImageUrl
      })
      
      if (response.status) {
        toast({
          title: "Success",
          description: "News article created successfully",
          variant: "default"
        })
        router.push("/admin/news")
      }
    } catch (error) {
      toast({
        title: "Error",
        // @ts-expect-error: error not defined
        description: error.message || "Failed to create news article",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setSlug(generateSlug(newTitle))
  }

  return (
    <div className={cn("container mx-auto", isLoading && "animate-pulse [animation-duration:1.5s]")}>
      <Card>
        <CardHeader>
          <CardTitle>Create News Article</CardTitle>
          <CardDescription>Add a new news article to your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter news title"disabled={isLoading}
              className={isLoading ? "animate-pulse" : ""} value={title} onChange={handleTitleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug"disabled={isLoading}
              className={isLoading ? "animate-pulse" : ""} value={slug} readOnly />
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
            <Label htmlFor="content">Content</Label>
            <RichTextEditor 
            disabled={isLoading}
            className={isLoading ? "animate-pulse" : ""}
            setValue={setContent} />
          </div>
          <div className="flex gap-4">
            <Button className={cn("flex-1", isLoading && "animate-pulse")} disabled={isLoading} onClick={handlePublish}>
              {
                isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )
              }
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {(title || content || coverImage) && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h1>{title}</h1>
              {coverImage && (
                <img
                  src={URL.createObjectURL(coverImage) || "/placeholder.svg"}
                  alt="Cover"
                  className="w-full rounded-lg object-cover my-4"
                />
              )}
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

