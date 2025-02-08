"use client"

import { NewsGrid } from "@/components/news-grid"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import type { NewsItem } from "@/types/news"
import axios from "axios"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { FC, useState } from "react"

interface Props {
  news: NewsItem[]
}

 const AdminNewsPageInner:FC<Props> = ({news}) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()

  const handlePreview = (slug: string) => {
    console.log("Preview:", slug)
  }

  const handleEdit = (slug: string) => {
    console.log("Edit:", slug)
  }

  const handleDelete = async (slug: string) => {
    setIsLoading(true)
    toast({
      title: `Loading. . .`,
      description: `We are ${slug} deleting now`,
      variant: "default"
    })
    try {
      const res = await axios.delete(`/api/news/${slug}`)
      if (res) {
        toast({
          title: `News Deleted successfully`,
          description: `${slug} deleted successfully`,
          variant: "default"
        })
      } else {
        toast({
          title: `Error deleting news`,
          description: `Something went wrong, please try again in a moment`,
          variant: "default"
        })
      }
    } catch (error) {
      toast({
        title: `Error deleting news`,
        // @ts-expect-error: error is not defined
        description: error.message || `Something went wrong, please try again in a moment`,
        variant: "default"
      })
    } finally {
      setIsLoading(false)
      router.refresh()
    }
  }

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