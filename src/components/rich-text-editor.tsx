"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block";
import { cn } from "@/lib/utils";
import axios from "axios";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // PrismJS uchun tema

export function RichTextEditor({ className, setValue, disabled }: { className?: string; setValue: (value: string) => void, disabled?: boolean }) {
  const [loading, setLoading] = useState(false);

  // TipTap Editor konfiguratsiyasi
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: "rich-text-editor",
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline rich-text-editor",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto rich-text-editor",
          style: "cursor: pointer;",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-gray-400 rich-text-editor",
        },
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-400 p-2 rich-text-editor",
        },
      }),
      TextStyle,
      Color,
      Highlight,
      Underline,
      CodeBlockLowlight.configure({
        // @ts-expect-error: error is not defined
        lowlight: {
          // @ts-expect-error: error is not defined
          highlight: (language, code) => {
            if (Prism.languages[language]) {
              return Prism.highlight(code, Prism.languages[language], language);
            } else {
              return code;
            }
          },
        },
      }),
    ],
    content: "<p>Matnni shu yerga yozing...</p>",
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  // Rasm yuklash funksiyasi
  const handleImageUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (file) {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post("/api/upload", formData);
          if (response.data.success) {
            editor?.chain().focus().setImage({ src: "/api/uploads/" + response.data.name }).run();
          } else {
            alert("Rasm yuklashda xatolik yuz berdi.");
          }
        } catch (error) {
          console.error(error);
          alert("API bilan muammo yuz berdi.");
        } finally {
          setLoading(false);
        }
      }
    };
    fileInput.click();
  };

  // Qo'shimcha funksiyalar
  const handleMark = () => {
    editor?.chain().focus().toggleHighlight().run();
  };

  return (
    <div className={cn("rounded-lg border bg-white shadow-sm", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b p-2">
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button
            key={level}
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
                .run()
            }
            className={`rounded px-2 py-1 ${
              editor?.isActive("heading", { level })
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            H{level}
          </button>
        ))}
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`rounded px-2 py-1 ${
            editor?.isActive("bold")
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`rounded px-2 py-1 ${
            editor?.isActive("italic")
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`rounded px-2 py-1 ${
            editor?.isActive("underline")
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          U
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={`rounded px-2 py-1 ${
            editor?.isActive("strike")
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          S
        </button>
        <button
          onClick={handleMark}
          className={`rounded px-2 py-1 ${
            editor?.isActive("highlight")
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Mark
        </button>
        <button
          onClick={handleImageUpload}
          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
          disabled={loading}
        >
          {loading ? "Yuklanmoqda..." : "Rasm"}
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={`rounded px-2 py-1 ${
            editor?.isActive("codeBlock")
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Kod
        </button>
      </div>

      {/* Editor */}
      <EditorContent
      disabled={disabled || false}
        editor={editor}
        className="min-h-[200px] p-4 outline-none"
      />
    </div>
  );
}