"use client"

import { NewsGrid } from "@/components/news-grid"
import { Button } from "@/components/ui/button"
import type { NewsItem } from "@/types/news"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { FC } from "react"

interface Props {
  news: NewsItem[]
}

 const AdminNewsPageInner:FC<Props> = ({news}) => {
  const handlePreview = (slug: string) => {
    console.log("Preview:", slug)
  }

  const handleEdit = (slug: string) => {
    console.log("Edit:", slug)
  }

  const handleDelete = (slug: string) => {
    console.log("Delete:", slug)
  }

  const router = useRouter()

  return (
    <div className="py-6 relative">
      <h1 className="text-2xl font-bold mb-6 px-4">News Management</h1>
      <Button variant={"outline"} className="right-0 top-4 absolute" onClick={() => router.push("/admin/create/news")}>
        <Plus className="mr-2 h-4 w-4" />
        <span>Add News</span>
      </Button>
      <NewsGrid items={news} onPreview={handlePreview} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}

export default AdminNewsPageInner