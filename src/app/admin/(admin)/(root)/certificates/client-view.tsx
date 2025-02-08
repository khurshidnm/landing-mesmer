"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CertificateCard } from "@/components/certificate-card"
import { ConfirmModal } from "@/components/confirm-modal"
import type { Certificate } from "@/types/certificates"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

export default function CertificatesPage({certificates}: {certificates: Certificate[]}) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleEdit = (id: string) => {
    router.push(`/admin/certificates/${id}`)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
      if (deleteId) {
        toast({
          title: "Deleting Certificate. . .",
          description: "Please wait, your certificate is being deleted",
        })
        try {
            const res = await axios.delete(`/api/certificates/${deleteId}`);
            if (res) {
              toast({
                title: "Success",
                description: "Certificate deleted successfully",
                variant: "default",
              });
            } else {
              toast({
                title: "Error",
                description: "Failed to delete certificate",
                variant: "destructive",
              });
            }
        } catch (error) {
          toast({
            title: "Error",
            description:
              // @ts-expect-error: error is not defined
              error.message || "Something went wrong, please try again in a moment",
            variant: "destructive",
          });
        } finally {
          router.refresh()
            setDeleteId(null)
        }
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Certificates</h1>
        <Button asChild>
          <Link href="/admin/create/certificate">Add New Certificate</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {certificates.map((certificate) => (
          <CertificateCard key={certificate._id} certificate={certificate} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Certificate"
        description="Are you sure you want to delete this certificate? This action cannot be undone."
      />
    </div>
  )
}