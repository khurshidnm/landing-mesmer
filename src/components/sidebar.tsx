"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  Briefcase,
  FolderKanban,
  Menu,
  LogOut,
  VerifiedIcon,
  Settings2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut } from "next-auth/react";

const menuItems = [
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

export function Sidebar() {
  const pathname = usePathname();
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <div className="h-screen fixed">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pl-1 pr-0">
          <SheetHeader>
            <SheetTitle className="px-6">Admin Panel</SheetTitle>
          </SheetHeader>
          <div className="px-2 py-6">
            <SidebarItems pathname={pathname} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[65px] items-center border-b px-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold"
            >
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="px-4 py-2">
              <SidebarItems pathname={pathname} />
            </div>
            <div className="p-4 w-full">
              <Button
                onClick={handleLogout}
                variant="outline"
                className={cn("w-full")}
              >
                <LogOut className={cn("h-5 w-5 mr-2")} />
                Chiqish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItems({ pathname }: { pathname: string | null }) {
  return (
    <div className="space-y-4 h-[calc(100vh_-_165px)]">
      <div className="px-3 py-2">
        <div className="space-y-1">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  pathname === item.href &&
                    "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
