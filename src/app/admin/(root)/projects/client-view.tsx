"use client"

import { ProjectsGrid } from "@/components/projects-grid"
import { Button } from "@/components/ui/button"
import { ProjectsItem } from "@/types/projects"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { FC } from "react"

interface Props {
  projects: ProjectsItem[]
}

 const AdminProjectsPageInner:FC<Props> = ({projects}) => {
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
      <h1 className="text-2xl font-bold mb-6 px-4">Projects Management</h1>
      <Button variant={"outline"} className="right-0 top-4 absolute" onClick={() => router.push("/admin/create/projects")}>
        <Plus className="mr-2 h-4 w-4" />
        <span>Add Project</span>
      </Button>
      <ProjectsGrid items={projects} onPreview={handlePreview} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}

export default AdminProjectsPageInner