"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export function RichTextEditor({ className }: { className?: string }) {
  const [content, setContent] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);

  // Formatlash funksiyalari
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus(); // Fokusni editorga qaytarish
  };

  // Rasm qo'shish
  const insertImage = () => {
    const url = prompt("Rasm URL manzilini kiriting:");
    if (url) {
      document.execCommand("insertImage", false, url);
    }
  };

  // Havola qo'shish
  const insertLink = () => {
    const url = prompt("Havola URL manzilini kiriting:");
    if (url) {
      document.execCommand("createLink", false, url);
    }
  };

  // Jadval qo'shish
  const insertTable = () => {
    const rows = prompt("Qatorlar sonini kiriting:", "2");
    const cols = prompt("Ustunlar sonini kiriting:", "2");
    if (rows && cols) {
      const table = document.createElement("table");
      table.setAttribute("border", "1");
      for (let i = 0; i < parseInt(rows); i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < parseInt(cols); j++) {
          const cell = document.createElement("td");
          cell.innerHTML = "&nbsp;";
          row.appendChild(cell);
        }
        table.appendChild(row);
      }
      document.execCommand("insertHTML", false, table.outerHTML);
    }
  };

  return (
    <div className={cn("rounded-lg border bg-white shadow-sm", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b p-2">
        <button
          onClick={() => formatText("formatBlock", "<h1>")}
          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          H1
        </button>
        <button
          onClick={() => formatText("formatBlock", "<h2>")}
          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          H2
        </button>
        <button
          onClick={() => formatText("formatBlock", "<h3>")}
          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          H3
        </button>
        <button
          onClick={() => formatText("bold")}
          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => formatText("italic")}
          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => formatText("underline")}
          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          <u>U</u>
        </button>
        <button
          onClick={insertLink}
          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          Link
        </button>
        <button
          onClick={insertImage}
          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          Image
        </button>
        <button
          onClick={() => formatText("insertUnorderedList")}
          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          List
        </button>
        <button
          onClick={insertTable}
          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          Table
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
        className="min-h-[200px] p-4 outline-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}