'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { PreviewModal } from './preview-modal'
import { EditModal } from './edit-modal'
import type { NewsItem, NewsGridProps } from '@/types/news'

export function NewsGrid({ items, onPreview, onEdit, onDelete }: NewsGridProps) {
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const handlePreview = (item: NewsItem) => {
    setSelectedItem(item)
    setIsPreviewOpen(true)
  }

  const handleEdit = (item: NewsItem) => {
    setSelectedItem(item)
    setIsEditOpen(true)
  }

  const handleDelete = (slug: string) => {
    onDelete(slug)
    setItemToDelete(null)
  }

  const handleSave = (updatedItem: NewsItem) => {
    onEdit(updatedItem.slug)
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.slug} className="overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={item.cover || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold line-clamp-2 mb-2">{item.title}</h3>
                <div 
                  className="text-sm text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePreview(item)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">Preview</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <AlertDialog open={itemToDelete === item.slug} onOpenChange={(open) => !open && setItemToDelete(null)}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setItemToDelete(item.slug)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        news article &quot;{item.title}&quot;.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(item.slug)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <PreviewModal
        item={selectedItem}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />

      <EditModal
        item={selectedItem}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={handleSave}
      />
    </>
  )
}
