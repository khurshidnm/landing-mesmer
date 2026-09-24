"use client";

import { ChevronDown, Mail, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import axios from "axios";

import { trackContactClick, trackStartProjectOpen } from "@/lib/analytics";
import { localizeHref, t as tr } from "@/lib/cms/definitions";
import { useSiteData, type MenuEntry } from "@/components/site/site-data";

function updateLocaleInUrl(locale: string, pathname: string): string {
  const urlParts = pathname.split("/");
  if (urlParts.length > 1) {
    urlParts[1] = locale; // Ikkinchi segmentni (locale) almashtirish
  }
  return `/${urlParts.slice(1).join("/")}`;
}

type MenuItem = { id: string; label: string; href: string; children: MenuItem[] };

const CTA_LABEL = { en: "Start a Project", ru: "Начать проект", uz: "Loyiha boshlash" } as const;
const CTA_SHORT = { en: "Project", ru: "Проект", uz: "Loyiha" } as const;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pathname = usePathname();
  const language = useLocale() as "en" | "ru" | "uz";
  const router = useRouter();
  const { menu } = useSiteData();

  const [constants, setConstants] = useState({ email: "info@mesmer.uz" });

  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const res = await axios.get("/api/consts");
        if (res.data?.data?.constant) setConstants(res.data.data.constant);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConstants();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the desktop dropdown on outside click or Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenDropdown(null);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setIsOpen(false);
  }, [pathname]);

  const items: MenuItem[] = useMemo(() => {
    const toItem = (e: MenuEntry): MenuItem => ({
      id: e._id,
      label: tr(e.label, language),
      href: localizeHref(e.href, language),
      children: [],
    });
    const tops = menu.filter((e) => !e.parent).map(toItem);
    for (const top of tops) {
      top.children = menu.filter((e) => e.parent === top.id).map(toItem);
    }
    return tops;
  }, [menu, language]);

  const isActive = (href: string) => {
    const path = href.split(/[?#]/)[0];
    return path !== `/${language}` && (pathname === path || pathname.startsWith(path + "/"));
  };

  const changeLanguage = (lang: string) => router.push(updateLocaleInUrl(lang.toLowerCase(), pathname));

  const openWithHover = (id: string) => {
    clearTimeout(closeTimer.current);
    setOpenDropdown(id);
  };
  const closeWithDelay = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const textColor = isScrolled ? "text-black" : "text-white";
  const ctaHref = `/${language}/start-a-project`;

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-20 transition-colors duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto py-4 whitespace-nowrap" ref={navRef}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 2xl:gap-8">
            <Link href={`/${language}`} className="shrink-0">
              <Image
                src={isScrolled ? "/blacklogo.svg" : "/logo.svg"}
                width={100}
                height={25}
                alt="Logo"
                className="w-[80px] md:w-[140px] object-cover min-w-[80px]"
              />
            </Link>

            {/* Desktop menu: dropdowns are absolutely positioned, so opening one never moves the page */}
            <ul className="hidden xl:flex items-center gap-3.5 2xl:gap-6 text-sm 2xl:text-[15px]">
              {items.map((item) => {
                const active = isActive(item.href) || item.children.some((c) => isActive(c.href));
                const hasChildren = item.children.length > 0;
                const open = openDropdown === item.id;
                return (
                  <li
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => hasChildren && openWithHover(item.id)}
                    onMouseLeave={() => hasChildren && closeWithDelay()}
                  >
                    <div className={`flex items-center gap-1 ${textColor}`}>
                      <Link
                        href={item.href}
                        className={`relative py-1 transition-colors hover:text-gray-500 ${active ? "font-bold" : ""}`}
                      >
                        {item.label}
                        {active && (
                          <span
                            className={`absolute bottom-0 left-0 h-0.5 w-full ${isScrolled ? "bg-black" : "bg-white"}`}
                          />
                        )}
                      </Link>
                      {hasChildren && (
                        <button
                          type="button"
                          aria-label={item.label}
                          aria-expanded={open}
                          onClick={() => setOpenDropdown(open ? null : item.id)}
                          className="p-0.5 hover:text-gray-500"
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {hasChildren && open && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full pt-3"
                        >
                          <ul className="min-w-[240px] rounded-lg border border-gray-100 bg-white p-2 shadow-xl">
                            {item.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={child.href}
                                  className={`block rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-50 hover:text-blue-600 ${
                                    isActive(child.href) ? "font-semibold text-blue-600" : "text-gray-800"
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={`flex items-center gap-3 2xl:gap-6 ${textColor}`}>
            <a
              href={`mailto:${constants.email}`}
              onClick={() => trackContactClick("email", constants.email)}
              className="hover:text-gray-600 transition-colors hidden 2xl:flex items-center gap-2"
              aria-label={constants.email}
            >
              <Mail size={18} />
              <span>{constants.email}</span>
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`${
                    isScrolled
                      ? "bg-transparent text-black border-black hover:bg-black hover:text-white"
                      : "bg-transparent text-white border-white hover:bg-white hover:text-black"
                  } transition-colors`}
                >
                  {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={`${isScrolled ? "bg-white" : "bg-white/10 backdrop-blur-md"} border-white/20`}
              >
                {["uz", "ru", "en"].map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`${
                      isScrolled ? "text-black hover:bg-gray-100" : "text-white hover:bg-white/20"
                    } transition-colors`}
                  >
                    {lang.toUpperCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href={ctaHref}
              onClick={() => trackStartProjectOpen()}
              className="hidden md:inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              {CTA_LABEL[language]}
            </Link>

            <div className="xl:hidden flex items-center gap-3">
              <Link
                href={ctaHref}
                onClick={() => trackStartProjectOpen()}
                className="md:hidden inline-flex h-8 items-center rounded-lg bg-blue-600 px-3 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-blue-700"
              >
                {CTA_SHORT[language]}
              </Link>
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Toggle Menu"
                className={`${textColor} p-2 hover:bg-gray-200/20 rounded-full transition-colors`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile / tablet drawer with accordion sub-menus */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm xl:hidden z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed inset-y-0 right-0 w-[85vw] max-w-[340px] bg-white shadow-2xl xl:hidden z-50 flex flex-col justify-between p-6 overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <Image src="/blacklogo.svg" width={100} height={25} alt="MESMER Logo" className="w-[100px] object-contain" />
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Menu"
                    className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={22} />
                  </button>
                </div>

                <ul className="mb-8 divide-y divide-gray-100">
                  {items.map((item) => {
                    const expanded = expandedMobile === item.id;
                    return (
                      <li key={item.id} className="py-1">
                        <div className="flex items-center justify-between">
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`block flex-1 py-2 text-base font-semibold transition-colors ${
                              isActive(item.href) ? "text-blue-600" : "text-gray-900 hover:text-blue-600"
                            }`}
                          >
                            {item.label}
                          </Link>
                          {item.children.length > 0 && (
                            <button
                              type="button"
                              aria-label={item.label}
                              aria-expanded={expanded}
                              onClick={() => setExpandedMobile(expanded ? null : item.id)}
                              className="p-2 text-gray-500 hover:text-blue-600"
                            >
                              <ChevronDown className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} />
                            </button>
                          )}
                        </div>
                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-3"
                            >
                              {item.children.map((child) => (
                                <li key={child.id}>
                                  <Link
                                    href={child.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block whitespace-normal py-1.5 text-sm text-gray-600 hover:text-blue-600"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>

                <Link
                  href={ctaHref}
                  onClick={() => {
                    setIsOpen(false);
                    trackStartProjectOpen();
                  }}
                  className="mb-6 block w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-bold text-white shadow-md hover:bg-blue-700"
                >
                  {CTA_LABEL[language]}
                </Link>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-4">
                <a
                  href={`mailto:${constants.email}`}
                  onClick={() => trackContactClick("email", constants.email)}
                  className="flex items-center gap-2.5 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <Mail size={16} className="text-blue-600" />
                  <span>{constants.email}</span>
                </a>
                <div className="flex items-center gap-2 pt-2">
                  {["uz", "ru", "en"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        changeLanguage(lang);
                        setIsOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                        language === lang ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
