import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Certificate } from "@/types/certificates"

interface CertificateCardProps {
  certificate: Certificate
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function CertificateCard({ certificate, onEdit, onDelete }: CertificateCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="aspect-square relative overflow-hidden rounded-md">
          <Image
            src={certificate.image || "/placeholder.svg"}
            alt={certificate.en.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <br />
        <div className="mt-2 space-y-1">
          <h3 className="text-lg font-semibold">{certificate.en.title}</h3>
          <p className="text-sm text-gray-500">{certificate.uz.title}</p>
          <p className="text-sm text-gray-500">{certificate.ru.title}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit(certificate._id)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(certificate._id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

