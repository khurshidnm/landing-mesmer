"use client"

import { useRouter } from "next/navigation"
import { CertificateForm } from "@/components/certificate-form"
import type { Certificate } from "@/types/certificates"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

export default function EditCertificatePage({certificate}: {certificate: Certificate}) {
  const router = useRouter()

  const handleSubmit = async (data: Partial<Certificate>) => {
    toast({
      title: "Creating Certificate. . .",
      description: "Please wait, your certificate is being created",
    })
    try {
      const res = await axios.put("/api/certificates/" + certificate._id, data);
      if (res) {
        toast({
          title: "Success",
          description: "Certificate created successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create certificate",
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
    }
    router.push("/admin/certificates");
  };


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Certificate</h1>
      <CertificateForm certificate={certificate} onSubmit={handleSubmit} />
    </div>
  )
}

