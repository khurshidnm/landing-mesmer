"use client"
import { useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor"; // Komponent joylashgan manzil

export default function Home() {
  const [content, setContent] = useState("");

  return (
    <div>
      <RichTextEditor value={content} onChange={setContent} />
    </div>
  );
}