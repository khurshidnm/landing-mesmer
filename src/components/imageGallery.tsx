import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import axios from "axios"
import { toast } from "@/hooks/use-toast"

interface ImageGalleryProps {
  images: string[]
  setImages: React.Dispatch<React.SetStateAction<string[]>>
}

export function ImageGallery({ images, setImages }: ImageGalleryProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setIsUploading(true)
      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData()
          formData.append("file", file)
          const response = await axios.post("/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          if (response.data.success) {
            return "/api/uploads/" + response.data.name
          }
          return null
        })

        const uploadedImages = await Promise.all(uploadPromises)
        const validImages = uploadedImages.filter((img): img is string => img !== null)

        setImages((prev) => [...prev, ...validImages])

        if (validImages.length > 0) {
          toast({
            title: "Success",
            description: `${validImages.length} image(s) uploaded successfully`,
            variant: "default",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload one or more images",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleImageDelete = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image || "/placeholder.svg"}
              alt={`Gallery image ${index + 1}`}
              className="w-24 h-24 object-cover rounded"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 rounded-full"
              onClick={() => handleImageDelete(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
          multiple // Add this to allow multiple file selection
        />
      </div>
    </div>
  )
}

