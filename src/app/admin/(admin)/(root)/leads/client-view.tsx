"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Download,
  RefreshCw,
  Eye,
  Trash2,
  FileText,
  Mail,
  Phone,
  Globe2,
  TrendingUp,
  Inbox,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  Building2,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LeadDetailsSheet, { LeadItem } from "./lead-details-sheet";
import { InquiryStatus, InquiryPriority } from "@/database/inquiry.model";

const STATUS_TABS: { key: string; label: string; countKey?: string }[] = [
  { key: "all", label: "All Leads" },
  { key: "new", label: "New", countKey: "new" },
  { key: "contacted", label: "Contacted", countKey: "contacted" },
  { key: "qualified", label: "Qualified", countKey: "qualified" },
  { key: "proposal_sent", label: "Proposal Sent", countKey: "proposal_sent" },
  { key: "won", label: "Won Deals", countKey: "won" },
  { key: "lost", label: "Lost", countKey: "lost" },
  { key: "spam", label: "Spam", countKey: "spam" },
];

const INQUIRY_TYPES = [
  "All Types",
  "EPC Turnkey Contract",
  "WWTP (Wastewater Treatment)",
  "WTP (Water Treatment Plant)",
  "Water Supply & Canals",
  "Equipment Procurement",
  "Operation & Maintenance (O&M)",
  "Strategic Partnership",
  "International Tender / RFP",
];

export default function LeadsClientView() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal_sent: 0,
    won: 0,
    lost: 0,
    spam: 0,
    inPipeline: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  // Detail Sheet State
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Deletion State
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "All Types") params.append("inquiryType", typeFilter);
      params.append("page", currentPage.toString());
      params.append("limit", "15");

      const res = await axios.get(`/api/admin/inquiries?${params.toString()}`);
      if (res.data?.success) {
        setLeads(res.data.data.inquiries || []);
        setTotalPages(res.data.data.pagination.totalPages || 1);
        setTotalLeads(res.data.data.pagination.total || 0);
        if (res.data.data.counts) {
          setCounts(res.data.data.counts);
        }
      }
    } catch (error) {
      console.error("Failed to load inquiries:", error);
      toast({
        title: "Error",
        description: "Failed to load inquiries. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, typeFilter, currentPage]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleLeadUpdate = (updatedLead: LeadItem) => {
    setLeads((prev) =>
      prev.map((item) => (item._id === updatedLead._id ? updatedLead : item))
    );
    setSelectedLead(updatedLead);
    // Refresh counts
    fetchLeads();
  };

  const handleDeleteLead = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(`/api/admin/inquiries/${id}`);
      if (res.data?.success) {
        toast({ title: "Deleted", description: "Inquiry removed successfully." });
        setLeads((prev) => prev.filter((item) => item._id !== id));
        fetchLeads();
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
      toast({
        title: "Delete failed",
        description: "Could not delete inquiry.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setLeadToDelete(null);
    }
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.append("search", search.trim());
    if (statusFilter !== "all") params.append("status", statusFilter);
    if (typeFilter !== "All Types") params.append("inquiryType", typeFilter);

    window.open(`/api/admin/inquiries/export?${params.toString()}`, "_blank");
  };

  const getStatusBadgeVariant = (status: InquiryStatus) => {
    switch (status) {
      case "new":
        return "info";
      case "contacted":
        return "warning";
      case "qualified":
        return "info";
      case "proposal_sent":
        return "info";
      case "won":
        return "success";
      case "lost":
        return "secondary";
      case "spam":
        return "destructive";
      default:
        return "default";
    }
  };

  const getPriorityBadge = (priority: InquiryPriority) => {
    switch (priority) {
      case "high":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-200">
            HIGH
          </span>
        );
      case "medium":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 border border-amber-200">
            MED
          </span>
        );
      case "low":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-blue-600" />
            Leads & Project Inquiries
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage incoming B2B inquiries, tender specifications, and client proposals
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLeads}
            disabled={isLoading}
            className="rounded-lg flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExportCsv}
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-none flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </Button>
        </div>
      </div>

      {/* 2. KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total */}
        <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Total Inquiries</span>
            <Building2 className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-3xl font-extrabold text-gray-950">{counts.total}</p>
          <p className="text-xs text-gray-400">All registered website leads</p>
        </div>

        {/* Card 2: New Unread */}
        <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-600 text-xs font-semibold uppercase">
            <span>New (Action Needed)</span>
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-blue-600">{counts.new}</p>
          <p className="text-xs text-gray-400">Pending initial response SLA</p>
        </div>

        {/* Card 3: Active Pipeline */}
        <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-600 text-xs font-semibold uppercase">
            <span>In Pipeline</span>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-3xl font-extrabold text-gray-950">{counts.inPipeline}</p>
          <p className="text-xs text-gray-400">Contacted, Qualified, Proposal</p>
        </div>

        {/* Card 4: Won Contracts */}
        <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-600 text-xs font-semibold uppercase">
            <span>Won / Contracted</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-950">{counts.won}</p>
          <p className="text-xs text-gray-400">Closed EPC/Engineering deals</p>
        </div>
      </div>

      {/* 3. Search and Status Tabs Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4 shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.key;
            const countVal = tab.countKey
              ? (counts as any)[tab.countKey] || 0
              : counts.total;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.key);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-none"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {countVal}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by company, contact person, email, phone, or scope..."
              className="pl-9 h-10 rounded-lg text-sm border-gray-300"
            />
          </div>

          {/* Inquiry Type Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            >
              {INQUIRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Leads Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/70">
            <TableRow>
              <TableHead className="font-bold text-xs">Company & Country</TableHead>
              <TableHead className="font-bold text-xs">Contact Person</TableHead>
              <TableHead className="font-bold text-xs">Inquiry Types</TableHead>
              <TableHead className="font-bold text-xs">Attachment</TableHead>
              <TableHead className="font-bold text-xs">Received</TableHead>
              <TableHead className="font-bold text-xs">Priority</TableHead>
              <TableHead className="font-bold text-xs">Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Loading leads...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-14 text-gray-500">
                  <Inbox className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="font-semibold text-base text-gray-800">No leads found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try adjusting your search keywords or status filters.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow
                  key={lead._id}
                  className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedLead(lead);
                    setIsSheetOpen(true);
                  }}
                >
                  {/* Company & Country */}
                  <TableCell className="font-medium">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-gray-950 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        {lead.company}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 pl-5">
                        <Globe2 className="w-3 h-3 text-gray-400" />
                        {lead.country || "Uzbekistan"}
                      </p>
                    </div>
                  </TableCell>

                  {/* Contact Person */}
                  <TableCell>
                    <div className="space-y-0.5 text-xs">
                      <p className="font-semibold text-gray-900">{lead.name}</p>
                      <p className="text-gray-500 truncate max-w-[160px]">{lead.email}</p>
                      <p className="text-gray-400">{lead.phone}</p>
                    </div>
                  </TableCell>

                  {/* Inquiry Types */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {lead.inquiryTypes?.slice(0, 2).map((type, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 font-normal"
                        >
                          {type.split(" ")[0]}
                        </Badge>
                      ))}
                      {lead.inquiryTypes && lead.inquiryTypes.length > 2 && (
                        <span className="text-[10px] text-gray-400 font-bold self-center">
                          +{lead.inquiryTypes.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* File Attachment */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {lead.file && lead.file.url ? (
                      <a
                        href={lead.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200/60"
                        title={lead.file.originalName || "Attached File"}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="max-w-[70px] truncate">
                          {lead.file.originalName || "Document"}
                        </span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
                  </TableCell>

                  {/* Priority */}
                  <TableCell>{getPriorityBadge(lead.priority || "medium")}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(lead.status || "new")}>
                      {lead.status?.replace("_", " ") || "new"}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedLead(lead);
                          setIsSheetOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="View Full Lead Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will permanently remove the inquiry from{" "}
                              <strong>{lead.company}</strong> ({lead.name}) and delete any
                              associated files. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteLead(lead._id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete Inquiry
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div className="p-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-500">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {leads.length > 0 ? (currentPage - 1) * 15 + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(currentPage * 15, totalLeads)}
            </span>{" "}
            of <span className="font-semibold text-gray-900">{totalLeads}</span> leads
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 text-xs rounded-lg"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
            </Button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 text-xs rounded-lg"
            >
              Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* 5. Lead Details Slide-over Sheet */}
      <LeadDetailsSheet
        lead={selectedLead}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onUpdate={handleLeadUpdate}
      />
    </div>
  );
}
