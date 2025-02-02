"use client"

import type React from "react"
import { useState } from "react"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateSlug } from "@/lib/generate-slug"

export default function VacanciesPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [employmentType, setEmploymentType] = useState("")
  const [location, setLocation] = useState("")
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
          <CardTitle>Create Vacancy</CardTitle>
          <CardDescription>Post a new job vacancy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" placeholder="Enter job title" value={title} onChange={handleTitleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} readOnly />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employment-type">Employment Type</Label>
              <Select value={employmentType} onValueChange={setEmploymentType}>
                <SelectTrigger id="employment-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <RichTextEditor value={description} onChange={setDescription} placeholder="Write the job description..." />
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
      {(title || description || employmentType || location) && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h1>{title}</h1>
              <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                {employmentType && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Type:</span>
                    <span className="capitalize">{employmentType}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Location:</span>
                    <span>{location}</span>
                  </div>
                )}
              </div>
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

