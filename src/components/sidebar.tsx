"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Newspaper,
  Briefcase,
  FolderKanban,
  Menu,
  LogOut,
  VerifiedIcon,
  Settings2,
  Inbox,
  Shield,
  Layers,
  PanelTop,
  Image as ImageIcon,
  BarChart3,
  Droplets,
  Landmark,
  Building2,
  Home,
  Info,
  Handshake,
  Search,
  PanelBottom,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";

const menuItems = [
  {
    title: "Leads & Inquiries",
    href: "/admin/leads",
    icon: Inbox,
    description: "Manage incoming B2B project leads",
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
    description: "Manage your projects",
  },
  {
    title: "News",
    href: "/admin/news",
    icon: Newspaper,
    description: "Manage news articles",
  },
  {
    title: "Vacancies",
    href: "/admin/vacancies",
    icon: Briefcase,
    description: "Manage job vacancies",
  },
  {
    title: "Certificates",
    href: "/admin/certificates",
    icon: VerifiedIcon,
    description: "Manage job certificates",
  },
  {
    title: "Site Settings",
    href: "/admin/consts",
    icon: Settings2,
    description: "Manage website settings",
  },
];

// Website Content sections (edited by /admin/content/[collection])
const contentItems = [
  { title: "Menu", href: "/admin/content/menu", icon: PanelTop },
  { title: "Home Hero", href: "/admin/content/hero", icon: ImageIcon },
  { title: "Key Numbers", href: "/admin/content/stats", icon: BarChart3 },
  { title: "Expertise", href: "/admin/content/expertise", icon: Droplets },
  { title: "Financiers", href: "/admin/content/financiers", icon: Landmark },
  { title: "MESMER Group", href: "/admin/content/group_companies", icon: Building2 },
  { title: "Home Page Texts", href: "/admin/content/home_content", icon: Home },
  { title: "About Page", href: "/admin/content/about_page", icon: Info },
  { title: "Partners", href: "/admin/content/partners", icon: Handshake },
  { title: "SEO", href: "/admin/content/seo", icon: Search },
  { title: "Footer & Contact", href: "/admin/content/site_texts", icon: PanelBottom },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [newLeadsCount, setNewLeadsCount] = useState<number>(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchLeadCount = async () => {
      try {
        const res = await axios.get("/api/admin/inquiries?limit=1&status=new");
        if (res.data?.data?.counts?.new !== undefined) {
          setNewLeadsCount(res.data.data.counts.new);
        }
      } catch {
        // Silently ignore if unauthenticated or network error
      }
    };
    fetchLeadCount();
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile Top Header with Drawer Trigger */}
      <div className="lg:hidden sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-extrabold text-sm shadow-sm">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-gray-950 leading-tight">
              MESMER
            </span>
            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
              Control Center
            </span>
          </div>
        </div>

        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-950">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col bg-white">
            <SheetHeader className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                  M
                </div>
                <SheetTitle className="text-left font-extrabold text-base text-gray-950">
                  MESMER Admin
                </SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <SidebarNav
                pathname={pathname}
                newLeadsCount={newLeadsCount}
                onNavigate={() => setIsMobileOpen(false)}
              />
            </div>
            <div className="border-t border-gray-100 p-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-gray-200 bg-white shadow-2xs dark:bg-gray-900 dark:border-gray-800">
        {/* Brand / Logo Header */}
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm font-black text-base">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-gray-950 dark:text-white leading-tight">
              MESMER-EAST
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Admin Control Center
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <SidebarNav pathname={pathname} newLeadsCount={newLeadsCount} />
        </div>

        {/* User Session & Logout Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50/50 dark:bg-gray-900/50 dark:border-gray-800">
          <div className="mb-3 flex items-center gap-2.5 px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold">
              {session?.user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-gray-900 truncate dark:text-gray-100">
                {session?.user?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-gray-500 truncate">
                {session?.user?.email || "admin@mesmer.uz"}
              </span>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-lg transition-colors"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}

function SidebarNav({
  pathname,
  newLeadsCount = 0,
  onNavigate,
}: {
  pathname: string | null;
  newLeadsCount?: number;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
        const isLeads = item.href === "/admin/leads";

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all",
              isActive
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                )}
              />
              <span>{item.title}</span>
            </div>
            {isLeads && newLeadsCount > 0 && (
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[10px] font-bold shadow-2xs",
                  isActive
                    ? "bg-white text-blue-700"
                    : "bg-blue-600 text-white"
                )}
              >
                {newLeadsCount}
              </span>
            )}
          </Link>
        );
      })}

      <p className="px-3.5 pb-1 pt-5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        Website Content
      </p>
      {contentItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all",
              isActive
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            )}
          >
            <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-gray-400")} />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
