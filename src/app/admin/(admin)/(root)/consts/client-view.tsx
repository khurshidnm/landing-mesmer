"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import {
  FileText,
  Loader2,
  UploadCloud,
  Check,
  Copy,
  ExternalLink,
  Trash2,
  RefreshCw,
  FolderOpen,
  Sparkles,
  FileDown,
  ImageIcon,
} from "lucide-react";

interface UploadedFileItem {
  name: string;
  url: string;
  size: number;
  updatedAt: string;
  extension: string;
}

function formatBytes(bytes: number, decimals = 1) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function Home({
  constants,
}: {
  constants: {
    email: string;
    number: string;
    location: string;
    address?: { uz?: string; ru?: string; en?: string };
    profile_pdf?: string;
    footer_bg?: string;
    logo: string;
    services_seo?: {
      uz?: { title?: string; description?: string };
      en?: { title?: string; description?: string };
      ru?: { title?: string; description?: string };
    };
  };
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [profilePdf, setProfilePdf] = useState(constants.profile_pdf || "");
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [deletingFileName, setDeletingFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [footerBg, setFooterBg] = useState(constants.footer_bg || "");
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [isDraggingBg, setIsDraggingBg] = useState(false);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Fetch recent uploaded files
  const fetchUploadedFiles = async () => {
    try {
      setLoadingFiles(true);
      const res = await axios.get("/api/admin/files");
      if (res.data?.success && Array.isArray(res.data.files)) {
        setUploadedFiles(res.data.files);
      }
    } catch {
      // Silently ignore if unauthorized or error
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const uploadFile = async (file: File) => {
    const validExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".zip"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(ext)) {
      toast({
        title: "Unsupported format",
        description: "Please upload PDF, DOC, DOCX or related document file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 25MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData);

      if (res.data?.success) {
        const newPdfUrl = "/api/uploads/" + res.data.name;
        setProfilePdf(newPdfUrl);

        // Instantly save to database so the user doesn't need to hunt for the save button
        try {
          await axios.put("/api/consts", { profile_pdf: newPdfUrl });
          toast({
            title: "File uploaded & live!",
            description: "Company profile updated and active on website footer.",
          });
        } catch {
          toast({
            title: "Uploaded (Pending Save)",
            description: "Click 'Save all changes' at the bottom to finalize.",
          });
        }

        fetchUploadedFiles();
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          (axios.isAxiosError(error) && error.response?.data?.error) ||
          "An error occurred while uploading the file.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleCopyLink = () => {
    const fullUrl = profilePdf.startsWith("http")
      ? profilePdf
      : window.location.origin + (profilePdf || "/MESMER%20RULES.pdf");
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    toast({
      title: "Link copied",
      description: "Company profile document link copied to clipboard.",
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleResetToDefault = async () => {
    if (!confirm("Are you sure you want to reset to the default company profile PDF?")) {
      return;
    }
    setProfilePdf("");
    try {
      await axios.put("/api/consts", { profile_pdf: "" });
      toast({
        title: "Reset to default",
        description: "Default company profile (MESMER RULES.pdf) is now active.",
      });
    } catch {
      toast({
        title: "Failed to reset",
        variant: "destructive",
      });
    }
  };

  const handleSetActiveFile = async (url: string) => {
    setProfilePdf(url);
    try {
      await axios.put("/api/consts", { profile_pdf: url });
      toast({
        title: "Active file changed",
        description: "Company profile document has been updated.",
      });
    } catch {
      toast({
        title: "Failed to update",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;
    setDeletingFileName(fileName);
    try {
      const res = await axios.delete(`/api/admin/files?name=${encodeURIComponent(fileName)}`);
      if (res.data?.success) {
        toast({ title: "File deleted successfully" });
        if (profilePdf.includes(fileName)) {
          setProfilePdf("");
          await axios.put("/api/consts", { profile_pdf: "" });
        }
        fetchUploadedFiles();
      }
    } catch {
      toast({
        title: "Failed to delete file",
        variant: "destructive",
      });
    } finally {
      setDeletingFileName(null);
    }
  };

  const uploadFooterBg = async (file: File) => {
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(ext)) {
      toast({
        title: "Unsupported format",
        description: "Please upload a JPG, PNG or WEBP image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum image size is 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingBg(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData);

      if (res.data?.success) {
        const newBgUrl = "/api/uploads/" + res.data.name;
        setFooterBg(newBgUrl);

        // Save immediately, same as the company profile upload
        try {
          await axios.put("/api/consts", { footer_bg: newBgUrl });
          toast({
            title: "Background updated",
            description: "The new footer background is live on the website.",
          });
        } catch {
          toast({
            title: "Uploaded but not saved",
            description: "Please try uploading the image again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          (axios.isAxiosError(error) && error.response?.data?.error) ||
          "An error occurred while uploading the image.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingBg(false);
    }
  };

  const handleResetFooterBg = async () => {
    if (!confirm("Reset the footer background to the default image?")) return;
    setFooterBg("");
    try {
      await axios.put("/api/consts", { footer_bg: "" });
      toast({
        title: "Reset to default",
        description: "The default footer background is now active.",
      });
    } catch {
      toast({ title: "Failed to reset", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const update = Object.fromEntries(
        // @ts-expect-error: error is not defined
        new FormData(e.currentTarget).entries()
      );

      const res = await axios.put("/api/consts", {
        number: update.phoneNumber || null,
        email: update.email || null,
        location: update.address_en || constants.location || "",
        address: {
          uz: update.address_uz || "",
          ru: update.address_ru || "",
          en: update.address_en || "",
        },
        profile_pdf: profilePdf,
        services_seo: {
          en: {
            title: update.services_seo_en_title || "",
            description: update.services_seo_en_description || "",
          },
          ru: {
            title: update.services_seo_ru_title || "",
            description: update.services_seo_ru_description || "",
          },
          uz: {
            title: update.services_seo_uz_title || "",
            description: update.services_seo_uz_description || "",
          },
        },
      });

      if (res.data) {
        window.location.reload();
        toast({
          title: "Successfully updated",
          description: "All settings saved successfully.",
          variant: "default",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong, please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentDisplayFileName = profilePdf
    ? decodeURIComponent(profilePdf.split("/").pop() || "Uploaded File")
    : "MESMER RULES.pdf (Default)";

  return (
    <div className="container p-4 max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Site Settings & File Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage company contact info, official documents, and search engine optimization (SEO).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ======================================================== */}
        {/* FILE UPLOAD & COMPANY PROFILE SECTION                    */}
        {/* ======================================================== */}
        <div className="border border-blue-200/80 rounded-2xl p-6 bg-gradient-to-b from-white to-blue-50/20 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100/80 text-blue-700">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  File Upload & Company Profile (PDF)
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Upload and manage the official company profile document attached to the website footer.
              </p>
            </div>
            <span className="self-start sm:self-center inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3 h-3" />
              Live Website Attachment
            </span>
          </div>

          {/* Website Footer Live Preview Box */}
          <div className="rounded-xl bg-[#080d1a] border border-gray-800 p-4 text-white space-y-2">
            <div className="flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800/80 pb-1.5">
              <span>Website Footer Preview</span>
              <span className="text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Linked to Live Site
              </span>
            </div>
            <div className="flex flex-col gap-1.5 pt-1 text-xs">
              <span className="text-gray-400 font-medium">
                © {new Date().getFullYear()} MESMER-EAST LLC
              </span>
              <a
                href={profilePdf || "/MESMER%20RULES.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 underline underline-offset-4 font-medium transition-colors w-fit"
              >
                <FileText className="w-4 h-4 shrink-0 text-blue-400" />
                <span>Download Company Profile (PDF)</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>
            </div>
          </div>

          {/* Current Active File Card */}
          <div className="rounded-xl border bg-white p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
                  <FileDown className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {currentDisplayFileName}
                    </p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {profilePdf ? profilePdf : "Default: /public/MESMER RULES.pdf"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href={profilePdf || "/MESMER%20RULES.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Preview
                </a>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {copiedLink ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedLink ? "Copied" : "Copy URL"}
                </button>
                {profilePdf && (
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                    title="Reset to default company rules file"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
              isDragging
                ? "border-blue-500 bg-blue-50/70 scale-[0.99]"
                : "border-gray-300 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={handleFileInputChange}
              disabled={isUploadingPdf}
            />

            <div className="flex flex-col items-center justify-center gap-2">
              <div
                className={`p-3 rounded-full transition-colors ${
                  isDragging
                    ? "bg-blue-100 text-blue-600"
                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                }`}
              >
                {isUploadingPdf ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>

              {isUploadingPdf ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-blue-600">
                    Uploading document...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Saving to server and updating website profile link
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-800">
                    Click to browse or drag & drop new file here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, DOC, DOCX, XLS (up to 25MB). Auto-saved upon upload.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Documents History Drawer */}
          <div className="border-t pt-3">
            <button
              type="button"
              onClick={() => setShowAllFiles(!showAllFiles)}
              className="flex items-center justify-between w-full text-xs font-semibold text-gray-700 hover:text-blue-600 py-1 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-blue-600" />
                Uploaded Documents Library ({uploadedFiles.length})
              </span>
              <span className="text-[11px] text-blue-600 underline">
                {showAllFiles ? "Hide files" : "Show uploaded files"}
              </span>
            </button>

            {showAllFiles && (
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
                {loadingFiles ? (
                  <div className="py-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading files...
                  </div>
                ) : uploadedFiles.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2 text-center">
                    No other files uploaded yet.
                  </p>
                ) : (
                  uploadedFiles.map((file) => {
                    const isCurrent = profilePdf.includes(file.name);
                    return (
                      <div
                        key={file.name}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors ${
                          isCurrent
                            ? "bg-blue-50/70 border-blue-200"
                            : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {file.name}
                            </p>
                            <span className="text-[10px] text-gray-400">
                              {formatBytes(file.size)} • {new Date(file.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isCurrent ? (
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                              Current
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetActiveFile(file.url)}
                              className="px-2 py-1 rounded bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 text-[11px] font-medium transition-colors"
                            >
                              Set as Profile
                            </button>
                          )}
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded text-gray-500 hover:text-blue-600 hover:bg-gray-100"
                            title="Preview file"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.origin + file.url);
                              toast({ title: "Link copied to clipboard" });
                            }}
                            className="p-1 rounded text-gray-500 hover:text-blue-600 hover:bg-gray-100"
                            title="Copy link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file.name)}
                            disabled={deletingFileName === file.name}
                            className="p-1 rounded text-red-500 hover:bg-red-50"
                            title="Delete file"
                          >
                            {deletingFileName === file.name ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* FOOTER BACKGROUND IMAGE SECTION                          */}
        {/* ======================================================== */}
        <div className="border rounded-2xl p-6 bg-card space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100/80 text-blue-700">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Footer Background Image
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                The photo shown behind the website footer. It fades to black at the bottom automatically.
              </p>
            </div>
            {footerBg && (
              <button
                type="button"
                onClick={handleResetFooterBg}
                className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                title="Reset to default footer background"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset to default
              </button>
            )}
          </div>

          {/* Live preview, styled like the website footer */}
          <div className="relative h-44 overflow-hidden rounded-xl bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={footerBg || "/banner.jpg"}
              alt="Footer background preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.9)_85%)]" />
            <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3 text-white">
              <div className="space-y-1">
                <p className="text-[10px] font-light uppercase tracking-wider text-white/70">
                  Company
                </p>
                <p className="text-xs font-medium">About Us · Services · Projects</p>
              </div>
              <span className="shrink-0 rounded bg-white/15 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">
                {footerBg ? "CUSTOM" : "DEFAULT"}
              </span>
            </div>
          </div>

          {/* Upload area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingBg(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDraggingBg(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingBg(false);
              const file = e.dataTransfer.files?.[0];
              if (file) uploadFooterBg(file);
            }}
            onClick={() => bgInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all ${
              isDraggingBg
                ? "border-blue-500 bg-blue-50/70 scale-[0.99]"
                : "border-gray-300 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20"
            }`}
          >
            <input
              ref={bgInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) uploadFooterBg(file);
              }}
              disabled={isUploadingBg}
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                {isUploadingBg ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">
                  {isUploadingBg
                    ? "Uploading image..."
                    : "Click to browse or drag & drop a new image"}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or WEBP up to 10MB. Wide landscape photos work best (at least 1920px wide). Auto-saved upon upload.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BASIC CONTACT INFORMATION SECTION                        */}
        {/* ======================================================== */}
        <div className="border rounded-2xl p-6 bg-card space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">
            Main Contact Information
          </h2>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
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
          {(["uz", "ru", "en"] as const).map((lang) => (
            <div className="space-y-2" key={lang}>
              <Label htmlFor={`address_${lang}`}>
                Address ({lang.toUpperCase()})
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  id={`address_${lang}`}
                  name={`address_${lang}`}
                  defaultValue={
                    constants.address?.[lang] ||
                    (lang === "en" ? constants.location : "")
                  }
                />
              )}
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* SERVICES / EXPERTISE SEO SETTINGS                        */}
        {/* ======================================================== */}
        <div className="border rounded-2xl p-6 bg-card space-y-4 shadow-xs">
          <div className="border-b pb-2">
            <h2 className="text-lg font-bold text-gray-900">
              Services Page SEO Metadata
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Search engine optimization meta titles and descriptions for Google & Yandex.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-3">
            <h3 className="text-sm font-semibold text-blue-900">
              English SEO (Target queries: water treatment company Uzbekistan, wastewater treatment EPC contractor, WWTP contractor Central Asia, etc.)
            </h3>
            <div className="space-y-1">
              <Label htmlFor="services_seo_en_title" className="text-xs font-medium">Meta Title (EN)</Label>
              <Input
                id="services_seo_en_title"
                name="services_seo_en_title"
                placeholder="Water Treatment Company Uzbekistan | Wastewater Treatment EPC Contractor | MESMER"
                defaultValue={constants.services_seo?.en?.title || ""}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="services_seo_en_description" className="text-xs font-medium">Meta Description (EN)</Label>
              <Input
                id="services_seo_en_description"
                name="services_seo_en_description"
                placeholder="MESMER is a premier water treatment company and wastewater treatment plant EPC contractor in Uzbekistan & Central Asia..."
                defaultValue={constants.services_seo?.en?.description || ""}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Russian SEO (RU)</h3>
            <div className="space-y-1">
              <Label htmlFor="services_seo_ru_title" className="text-xs font-medium">Meta Title (RU)</Label>
              <Input
                id="services_seo_ru_title"
                name="services_seo_ru_title"
                placeholder="EPC-подрядчик водоочистных сооружений и ВОС/КОС в Узбекистане | MESMER"
                defaultValue={constants.services_seo?.ru?.title || ""}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="services_seo_ru_description" className="text-xs font-medium">Meta Description (RU)</Label>
              <Input
                id="services_seo_ru_description"
                name="services_seo_ru_description"
                placeholder="MESMER — ведущий EPC-подрядчик по строительству водоочистных сооружений (ВОС) и очистных сооружений сточных вод (КОС)..."
                defaultValue={constants.services_seo?.ru?.description || ""}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Uzbek SEO (UZ)</h3>
            <div className="space-y-1">
              <Label htmlFor="services_seo_uz_title" className="text-xs font-medium">Meta Title (UZ)</Label>
              <Input
                id="services_seo_uz_title"
                name="services_seo_uz_title"
                placeholder="O'zbekistonda suv tozalash va oqova suv tozalash inshootlari EPC pudratchisi | MESMER"
                defaultValue={constants.services_seo?.uz?.title || ""}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="services_seo_uz_description" className="text-xs font-medium">Meta Description (UZ)</Label>
              <Input
                id="services_seo_uz_description"
                name="services_seo_uz_description"
                placeholder="MESMER — O'zbekiston va Markaziy Osiyoda suv tozalash va oqova suv tozalash inshootlari (WTP, WWTP) bo'yicha yetakchi EPC pudratchisi..."
                defaultValue={constants.services_seo?.uz?.description || ""}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-base font-semibold shadow-sm"
          disabled={isLoading || isUploadingPdf || isUploadingBg}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving changes...
            </span>
          ) : (
            "Save All Settings"
          )}
        </Button>
      </form>
    </div>
  );
}
