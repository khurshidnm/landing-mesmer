"use client";

import React, { useState, useEffect } from "react";
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
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { cn } from "@/lib/utils";
import axios from "axios";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

export function RichTextEditor({
  className,
  setValue,
  disabled,
  value,
}: {
  className?: string;
  setValue: (value: string) => void;
  disabled?: boolean;
  value?: string;
}) {
  const [loading, setLoading] = useState(false);

  // TipTap Editor konfiguratsiyasi
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      Highlight,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      CodeBlockLowlight.configure({
        // @ts-expect-error: `lowlight` is a required option
        lowlight: {
          highlight: (language: string, code: string) => {
            return Prism.languages[language]
              ? Prism.highlight(code, Prism.languages[language], language)
              : code;
          },
        },
      }),
    ],
    content:
      value || '<p class="rich-text-editor">Matnni shu yerga yozing...</p>',
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  // value o'zgarganda editor kontentini yangilash
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(
        value || '<p class="rich-text-editor">Matnni shu yerga yozing...</p>'
      );
    }
  }, [value, editor]);

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
            editor
              ?.chain()
              .focus()
              .setImage({ src: "/api/uploads/" + response.data.name })
              .run();
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

  // Link qo'shish funksiyasi
  const addLink = () => {
    const url = prompt("Havola manzilini kiriting:");
    if (url) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  return (
    <div
      className={cn(
        "rich-text-editor rounded-b-lg border bg-white shadow-sm",
        className
      )}
    >
      {/* Toolbar */}
      <div className="rich-text-editor flex flex-wrap gap-2 border-b p-2">
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button
            key={level}
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleHeading({ level } as any)
                .run()
            }
            className={`rich-text-editor px-2 py-1 ${
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
          className="rich-text-editor px-2 py-1"
        >
          B
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className="rich-text-editor px-2 py-1"
        >
          I
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className="rich-text-editor px-2 py-1"
        >
          U
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className="rich-text-editor px-2 py-1"
        >
          S
        </button>
        <button
          onClick={addLink}
          className="rich-text-editor bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          🔗 Link
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className="rich-text-editor px-2 py-1"
        >
          • List
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className="rich-text-editor px-2 py-1"
        >
          1. List
        </button>
        <button
          onClick={handleImageUpload}
          className="rich-text-editor bg-gray-200 px-2 py-1 hover:bg-gray-300"
          disabled={loading}
        >
          {loading ? "Yuklanmoqda..." : "Rasm"}
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className="rich-text-editor px-2 py-1"
        >
          Kod
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        disabled={disabled || false}
        editor={editor}
        className="rich-text-editor min-h-[200px] p-4 outline-none"
      />
    </div>
  );
}
