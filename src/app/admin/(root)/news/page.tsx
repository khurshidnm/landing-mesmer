"use client"

import type React from "react"
import { useState } from "react"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateSlug } from "@/lib/generate-slug"

export default function NewsPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [slug, setSlug] = useState("")

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setSlug(generateSlug(newTitle))
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create News Article</CardTitle>
          <CardDescription>Add a new news article to your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter news title" value={title} onChange={handleTitleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image</Label>
            <Input
              id="cover"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files ? e.target.files[0] : null)}
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
            // @ts-expect-error: error is not defined
            value={content} onChange={setContent} placeholder="Write your news article..." />
          </div>
          <div className="flex gap-4">
            <Button className="flex-1" variant="outline">
              Save as Draft
            </Button>
            <Button className="flex-1">Publish</Button>
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

