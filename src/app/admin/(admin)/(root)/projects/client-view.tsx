"use client"

import { ProjectsGrid } from "@/components/projects-grid"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { ProjectsItem } from "@/types/projects"
import axios from "axios"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { FC } from "react"

interface Props {
  projects: ProjectsItem[]
}

 const AdminProjectsPageInner:FC<Props> = ({projects}) => {
  const router = useRouter()
  const handlePreview = (slug: string) => {
    console.log("Preview:", slug)
  }

  const handleEdit = (slug: string) => {
    router.push(`/admin/projects/${slug}`)
    console.log("Edit:", slug)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/projects/${id}`)
      if (res) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        // @ts-expect-error: error is not defined
        description: error.message || "Something went wrong, please try again in a moment",
        variant: "destructive",
      })
    } finally {
      router.refresh()
    }
  }

  return (
    <div className="py-6 relative">
      <h1 className="text-2xl font-bold mb-6 px-4">Projects Management</h1>
      <Button variant={"outline"} className="right-0 top-4 absolute" onClick={() => router.push("/admin/create/projects")}>
        <Plus className="mr-2 h-4 w-4" />
        <span>Add Project</span>
      </Button>
      <ProjectsGrid items={projects} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}

export default AdminProjectsPageInner