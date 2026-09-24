"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { VACANCY_CATEGORIES } from "@/lib/cms/definitions";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSlug } from "@/lib/generate-slug";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Vacancy } from "../types";
import { Trash2 } from "lucide-react";

interface LanguageFields {
  title: string;
  company: string;
  conditions: string[];
  requirements: string[];
  responsibilities: string[];
}

export default function VacanciesEditInnerPage({
  vacancy,
}: {
  vacancy: Vacancy;
}) {
  const [en, setEn] = useState<LanguageFields>({
    title: "",
    company: "",
    conditions: [""],
    requirements: [""],
    responsibilities: [""],
  });
  const [uz, setUz] = useState<LanguageFields>({
    title: "",
    company: "",
    conditions: [""],
    requirements: [""],
    responsibilities: [""],
  });
  const [ru, setRu] = useState<LanguageFields>({
    title: "",
    company: "",
    conditions: [""],
    requirements: [""],
    responsibilities: [""],
  });
  const [salary, setSalary] = useState("");
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setEn(vacancy.en);
    setUz(vacancy.uz);
    setRu(vacancy.ru);
    setSalary(vacancy.salary);
    setCategory(vacancy.category || "");
    setSlug(vacancy.slug);
  }, []);

  const router = useRouter();

  const handleEnTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setEn({ ...en, title: newTitle });
    setSlug(generateSlug(newTitle));
  };

  const handleArrayChange = (
    lang: "en" | "uz" | "ru",
    field: "conditions" | "requirements" | "responsibilities",
    index: number,
    value: string
  ) => {
    const updatedLang = { ...eval(lang) };
    updatedLang[field][index] = value;
    eval(`set${lang.charAt(0).toUpperCase() + lang.slice(1)}(updatedLang)`);
  };

  const addArrayItem = (
    lang: "en" | "uz" | "ru",
    field: "conditions" | "requirements" | "responsibilities"
  ) => {
    const updatedLang = { ...eval(lang) };
    updatedLang[field].push("");
    eval(`set${lang.charAt(0).toUpperCase() + lang.slice(1)}(updatedLang)`);
  };

  const removeArrayItem = (
    lang: "en" | "uz" | "ru",
    field: "conditions" | "requirements" | "responsibilities",
    index: number
  ) => {
    const updatedLang = { ...eval(lang) };
    updatedLang[field].splice(index, 1);
    eval(`set${lang.charAt(0).toUpperCase() + lang.slice(1)}(updatedLang)`);
  };

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      const res = await axios.put(`/api/vacancies/${vacancy._id}`, {
        en,
        uz,
        ru,
        salary,
        slug,
        category,
      });
      if (res) {
        toast({
          title: "Success",
          description: "Vacancy created successfully",
          variant: "default",
        });
        router.push("/admin/vacancies");
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
          description:
            error.message ||
            "Something went wrong, please try again in a moment",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong, please try again in a moment",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderLanguageFields = (lang: "en" | "uz" | "ru") => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${lang}-title`}>Title</Label>
        <Input
          id={`${lang}-title`}
          value={lang === "en" ? en.title : eval(lang).title}
          onChange={
            lang === "en"
              ? handleEnTitleChange
              : (e) =>
                  eval(
                    `set${
                      lang.charAt(0).toUpperCase() + lang.slice(1)
                    }({ ...${lang}, title: e.target.value })`
                  )
          }
          placeholder={`Enter ${lang.toUpperCase()} title`}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${lang}-company`}>Company</Label>
        <Input
          id={`${lang}-company`}
          value={eval(lang).company}
          onChange={(e) =>
            eval(
              `set${
                lang.charAt(0).toUpperCase() + lang.slice(1)
              }({ ...${lang}, company: e.target.value })`
            )
          }
        />
      </div>
      {["conditions", "requirements", "responsibilities"]?.map((field) => (
        <div key={field} className="space-y-2">
          <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
          {eval(lang)[field]?.map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Input
                value={item}
                onChange={(e) =>
                  handleArrayChange(
                    lang,
                    field as "conditions" | "requirements" | "responsibilities",
                    index,
                    e.target.value
                  )
                }
                className=""
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  removeArrayItem(
                    lang,
                    field as "conditions" | "requirements" | "responsibilities",
                    index
                  )
                }
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addArrayItem(
                lang,
                field as "conditions" | "requirements" | "responsibilities"
              )
            }
          >
            Add {field.slice(0, -1)}
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Vacancy</CardTitle>
          <CardDescription>Post a new job vacancy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="en">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="uz">O'zbekcha</TabsTrigger>
              <TabsTrigger value="ru">Русский</TabsTrigger>
            </TabsList>
            <TabsContent value="en">{renderLanguageFields("en")}</TabsContent>
            <TabsContent value="uz">{renderLanguageFields("uz")}</TabsContent>
            <TabsContent value="ru">{renderLanguageFields("ru")}</TabsContent>
          </Tabs>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">— Not specified —</option>
              {VACANCY_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.en}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">Used by the Careers menu (Engineering, Project Management, O&M).</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              value={salary}
              type="text"
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Enter salary information"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} readOnly />
          </div>
          <div className="flex gap-4">
            <Button
              className={cn("flex-1", isLoading && "animate-pulse")}
              onClick={handlePublish}
              disabled={isLoading}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {(en.title || en.company || salary) && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h1>{en.title}</h1>
              <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                {en.company && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Company:</span>
                    <span>{en.company}</span>
                  </div>
                )}
                {salary && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Salary:</span>
                    <span>{salary}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
