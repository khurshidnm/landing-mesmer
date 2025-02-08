"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Vacancy } from "./types"

interface EditVacancyDialogProps {
  vacancy: Vacancy | null
  onClose: () => void
  onSave: (vacancy: Vacancy) => void
}

export default function EditVacancyDialog({ vacancy, onClose, onSave }: EditVacancyDialogProps) {
  const [editedVacancy, setEditedVacancy] = useState<Vacancy | null>(null)

  useEffect(() => {
    setEditedVacancy(vacancy)
  }, [vacancy])

  if (!editedVacancy) return null

  const handleChange = (field: string, value: string, lang?: "en" | "uz" | "ru") => {
    setEditedVacancy((prev) => {
      if (!prev) return null
      if (lang) {
        return { ...prev, [lang]: { ...prev[lang], [field]: value } }
      }
      return { ...prev, [field]: value }
    })
  }

  const handleSave = () => {
    if (editedVacancy) {
      onSave(editedVacancy)
    }
  }

  return (
    <Dialog open={!!vacancy} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Vacancy</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {["en", "uz", "ru"].map((lang) => (
            <div key={lang} className="grid gap-2">
              <h3 className="font-semibold capitalize">{lang}</h3>
              <Input
                value={editedVacancy[lang as "en" | "uz" | "ru"].title}
                onChange={(e) => handleChange("title", e.target.value, lang as "en" | "uz" | "ru")}
                placeholder="Title"
              />
              <Input
                value={editedVacancy[lang as "en" | "uz" | "ru"].company}
                onChange={(e) => handleChange("company", e.target.value, lang as "en" | "uz" | "ru")}
                placeholder="Company"
              />
              <Textarea
                value={editedVacancy[lang as "en" | "uz" | "ru"].conditions.join("\n")}
                onChange={(e) => handleChange("conditions", e.target.value, lang as "en" | "uz" | "ru")}
                placeholder="Conditions (one per line)"
              />
              <Textarea
                value={editedVacancy[lang as "en" | "uz" | "ru"].requirements.join("\n")}
                onChange={(e) => handleChange("requirements", e.target.value, lang as "en" | "uz" | "ru")}
                placeholder="Requirements (one per line)"
              />
              <Textarea
                value={editedVacancy[lang as "en" | "uz" | "ru"].responsibilities.join("\n")}
                onChange={(e) => handleChange("responsibilities", e.target.value, lang as "en" | "uz" | "ru")}
                placeholder="Responsibilities (one per line)"
              />
            </div>
          ))}
          <Input
            value={editedVacancy.salary}
            onChange={(e) => handleChange("salary", e.target.value)}
            placeholder="Salary"
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

