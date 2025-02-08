"use client";

import VacanciesTable from "./vacancies-table";
import type { Vacancy } from "./types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

export default function VacanciesPage({ vacancies }: { vacancies: Vacancy[] }) {
  const router = useRouter();

  const deleteVacancy = async (id: string) => {
    try {
      const res = await axios.delete(`/api/vacancies/${id}`);
      if (res) {
        toast({
          title: "Success",
          description: "Vacancy deleted successfully",
          variant: "default",
        });
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: "Something went wrong, please try again in a moment",
          variant: "default",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "Something went wrong, please try again in a moment",
          variant: "default",
        });
    }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="w-full flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Vacancies</h1>
        <Button
          variant={"outline"}
          onClick={() => router.push("/admin/create/vacancies")}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Vacancy
        </Button>
      </div>
      <VacanciesTable
        vacancies={vacancies}
        onDelete={deleteVacancy}
      />
    </div>
  );
}
