"use client";

import { Sidebar } from "@/components/sidebar";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import PageLoading from "./loading";
import Link from "next/link";
import { ExternalLink, Globe, UserCheck } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

const AdminLayout: FC<Props> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/admin/login");
    } else if (session.status === "authenticated") {
      setAuthenticated(true);
    }
  }, [pathname, session, router]);

  const getSectionTitle = () => {
    if (pathname.includes("/admin/leads")) return "Leads & Project Inquiries";
    if (pathname.includes("/admin/projects")) return "Water Infrastructure Projects";
    if (pathname.includes("/admin/news")) return "Corporate News & Publications";
    if (pathname.includes("/admin/vacancies")) return "Job Vacancies";
    if (pathname.includes("/admin/certificates")) return "Certificates & Licenses";
    if (pathname.includes("/admin/consts")) return "Site Settings & Contacts";
    if (pathname.includes("/admin/content")) return "Website Content";
    return "Control Dashboard";
  };

  return authenticated ? (
    <div className="min-h-screen bg-gray-50/70 dark:bg-gray-950 flex flex-col">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 hidden lg:flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-8 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-gray-950 dark:text-white">
              {getSectionTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/en"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-xl border border-gray-200 hover:border-blue-200 bg-white shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Website</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </Link>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  ) : (
    <PageLoading />
  );
};

export default AdminLayout;