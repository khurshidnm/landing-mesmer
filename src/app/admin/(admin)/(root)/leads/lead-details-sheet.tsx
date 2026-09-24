"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe2,
  Calendar,
  FileText,
  Download,
  Copy,
  Check,
  Tag,
  AlertCircle,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Shield,
} from "lucide-react";
import { InquiryStatus, InquiryPriority } from "@/database/inquiry.model";

export interface LeadItem {
  _id: string;
  name: string;
  company: string;
  country?: string;
  email: string;
  phone: string;
  inquiryTypes: string[];
  message: string;
  file?: {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
  } | null;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
    referrer?: string;
  };
  locale: "en" | "ru" | "uz";
  status: InquiryStatus;
  priority: InquiryPriority;
  notes?: string;
  assignedTo?: string;
  budget?: string;
  ip?: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadDetailsSheetProps {
  lead: LeadItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedLead: LeadItem) => void;
}

const STATUS_CONFIG: Record<
  InquiryStatus,
  { label: string; variant: "info" | "warning" | "success" | "destructive" | "secondary" | "default" }
> = {
  new: { label: "New Lead", variant: "info" },
  contacted: { label: "Contacted", variant: "warning" },
  qualified: { label: "Qualified", variant: "default" },
  proposal_sent: { label: "Proposal Sent", variant: "info" },
  won: { label: "Won / Contracted", variant: "success" },
  lost: { label: "Lost", variant: "secondary" },
  spam: { label: "Spam", variant: "destructive" },
};

const PRIORITY_CONFIG: Record<InquiryPriority, { label: string; color: string }> = {
  high: { label: "High Priority", color: "text-red-700 bg-red-50 border-red-200" },
  medium: { label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  low: { label: "Low", color: "text-slate-600 bg-slate-50 border-slate-200" },
};

export default function LeadDetailsSheet({
  lead,
  isOpen,
  onClose,
  onUpdate,
}: LeadDetailsSheetProps) {
  const [status, setStatus] = useState<InquiryStatus>("new");
  const [priority, setPriority] = useState<InquiryPriority>("medium");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [budget, setBudget] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      setStatus(lead.status || "new");
      setPriority(lead.priority || "medium");
      setNotes(lead.notes || "");
      setAssignedTo(lead.assignedTo || "");
      setBudget(lead.budget || "");
    }
  }, [lead]);

  if (!lead) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast({ title: "Copied to clipboard", description: text });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await axios.patch(`/api/admin/inquiries/${lead._id}`, {
        status,
        priority,
        notes,
        assignedTo,
        budget,
      });

      if (res.data?.success) {
        toast({
          title: "Lead updated",
          description: "All changes and team notes have been saved.",
        });
        onUpdate(res.data.data.inquiry);
      } else {
        toast({
          title: "Update failed",
          description: res.data?.error || "Could not save changes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving lead changes:", error);
      toast({
        title: "Error",
        description: "Failed to update lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formattedDate = lead.createdAt
    ? new Date(lead.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col bg-white"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
          <SheetHeader className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Lead Dossier #{lead._id.slice(-6).toUpperCase()}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_CONFIG[status]?.variant || "default"}>
                  {STATUS_CONFIG[status]?.label || status}
                </Badge>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                    PRIORITY_CONFIG[priority]?.color
                  }`}
                >
                  {PRIORITY_CONFIG[priority]?.label}
                </span>
              </div>
            </div>
            <SheetTitle className="text-xl font-bold text-gray-950 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-600" />
              {lead.company}
            </SheetTitle>
            <SheetDescription className="text-xs text-gray-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Received on {formattedDate} • Locale: {lead.locale?.toUpperCase()}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* 1. Contact Information Card */}
          <div className="rounded-lg border border-gray-200 bg-gray-50/40 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Contact Person</p>
                <p className="font-semibold text-gray-900">{lead.name}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Country / Region</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                  {lead.country || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Corporate Email</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <a
                    href={`mailto:${lead.email}`}
                    className="font-semibold text-blue-600 hover:underline truncate"
                  >
                    {lead.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(lead.email, "email")}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500"
                    title="Copy Email"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Phone Number</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <a
                    href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                    className="font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {lead.phone}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(lead.phone, "phone")}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500"
                    title="Copy Phone"
                  >
                    {copiedField === "phone" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Inquiry Types */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Requested Inquiry Types
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {lead.inquiryTypes && lead.inquiryTypes.length > 0 ? (
                lead.inquiryTypes.map((type, idx) => (
                  <Badge key={idx} variant="secondary" className="px-2.5 py-1">
                    {type}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic">No specific types checked</span>
              )}
            </div>
          </div>

          {/* 3. Project Scope / Message */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Project Description & Requirements
            </h3>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
              {lead.message}
            </div>
          </div>

          {/* 4. Attached File / Tender Specification */}
          {lead.file && lead.file.url && (
            <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {lead.file.originalName || lead.file.filename}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {formatFileSize(lead.file.size)} • {lead.file.mimeType}
                  </p>
                </div>
              </div>
              <a
                href={lead.file.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shrink-0 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
            </div>
          )}

          {/* 5. Marketing Attribution & UTM */}
          <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-3.5 space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Source & Marketing Attribution
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">Source</span>
                <span className="font-semibold text-gray-800">
                  {lead.utm?.source || "Direct / Organic"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Medium</span>
                <span className="font-semibold text-gray-800">
                  {lead.utm?.medium || "None"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Campaign</span>
                <span className="font-semibold text-gray-800 truncate block">
                  {lead.utm?.campaign || "None"}
                </span>
              </div>
              {lead.ip && (
                <div>
                  <span className="text-gray-400 block text-[10px]">IP Address</span>
                  <span className="font-mono text-[11px] text-gray-700">{lead.ip}</span>
                </div>
              )}
              {lead.utm?.referrer && (
                <div className="col-span-2">
                  <span className="text-gray-400 block text-[10px]">Referrer</span>
                  <span className="text-[11px] text-gray-700 truncate block">
                    {lead.utm.referrer}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 6. Lead Status, Priority & Internal Team Notes */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Lead Management & Team Follow-Up
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Pipeline Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InquiryStatus)}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="won">Won / Contracted</option>
                  <option value="lost">Lost</option>
                  <option value="spam">Spam</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as InquiryPriority)}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Assigned Team Member
                </label>
                <Input
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g. EPC Commercial Manager"
                  className="h-10 rounded-lg text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Estimated Contract Budget
                </label>
                <Input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. $2.5M / €1.8M"
                  className="h-10 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Internal Sales & Engineering Notes
              </label>
              <Textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add meeting notes, technical qualification findings, proposal deadlines..."
                className="rounded-lg text-sm leading-relaxed border-gray-200 resize-y"
              />
            </div>

            <Button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-none transition-colors"
            >
              {isSaving ? "Saving Changes..." : "Save Lead Updates & Notes"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
