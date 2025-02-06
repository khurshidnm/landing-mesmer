import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { ProjectsItem } from "@/types/projects"

interface PreviewModalProps {
  item: ProjectsItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreviewModal({ item, open, onOpenChange }: PreviewModalProps) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[calc(100vh_-_10rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview Project</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="relative aspect-video mb-4">
            <Image src={item.cover || "/placeholder.svg"} alt={item?.uz?.title} fill className="object-cover rounded-lg" />
          </div>
          <h2 className="text-2xl font-bold mb-4">{item?.uz?.title}</h2>
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: item?.uz?.description }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

