"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
// import { siteInfo as initialSiteInfo } from "@/lib/constants"
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home({
  constants,
}: {
  constants: { email: string; number: string; location: string, logo: string };
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const update = Object.fromEntries(
        // @ts-expect-error: error is not defined
        new FormData(e.currentTarget).entries()
      )
      console.log(update)
      const res = await axios.put("/api/consts", {
        number: update.phoneNumber || null,
        email: update.email || null,
        location: update.location || null,
      });
      if (res.data) {
        window.location.reload()
        toast({
          title: "Successfully updated",
          description: "Data update at one mintute",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again in a moment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Sayt ma&apos;lumotlari
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Telefon raqami</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              id="phoneNumber"
              name="phoneNumber"
              defaultValue={constants.number}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={constants.email}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Joylashuv</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              id="location"
              name="location"
              defaultValue={constants.location}
            />
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </form>
    </div>
  );
}
