"use client";

import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import axios from "axios";

function updateLocaleInUrl(locale: string, pathname: string): string {
  const urlParts = pathname.split("/");
  if (urlParts.length > 1) {
    urlParts[1] = locale; // Ikkinchi segmentni (locale) almashtirish
  }
  return `/${urlParts.slice(1).join("/")}`;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  // locale
  const language = useLocale();
  const t = useTranslations("navbar");

  const router = useRouter();


  const [constants, setConstants] = useState({
    number: "+ 998 (55) 518 88 70",
    email: "info@mesmer.uz",
    location: "Ташкент, Алмазарский район, улица Широк, 100. Индекс 100069",
  });

  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const res = await axios.get("/api/consts");
        if (res.data) {
          setConstants(res.data.data.constant);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchConstants()
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const changeLanguage = (lang: string) =>
    router.push(updateLocaleInUrl(lang.toLowerCase(), pathname));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const linkVariants = {
    closed: { x: 20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  const links = [
    { text: t("about"), href: `/${language}/about` },
    { text: t("services"), href: `/${language}/services` },
    { text: t("projects"), href: `/${language}/projects` },
    { text: t("news"), href: `/${language}/news` },
    { text: t("career"), href: `/${language}/career` },
    { text: t("contacts"), href: `/${language}/contact` },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-20 transition-colors duration-300  ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto py-4 whitespace-nowrap">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-16">
            <Link href={"/"}>
              <Image
                src={isScrolled ? "/blacklogo.svg" : "/logo.svg"}
                width={100}
                height={25}
                alt="Logo"
                className="w-[80px] md:w-[100px]"
              />
            </Link>
            <div className="hidden lg:flex w-full  px-10  space-x-6">
              {links.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  className={`${
                    isScrolled ? "text-black" : "text-white"
                  } hover:text-gray-600 transition-colors relative ${
                    pathname === link.href ? "font-bold" : ""
                  }`}
                >
                  {link.text}
                  {pathname === link.href && (
                    <motion.div
                      className={`absolute bottom-0 left-0 w-full h-0.5 ${
                        isScrolled ? "bg-black" : "bg-white"
                      }`}
                      layoutId="underline"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div
            className={`flex items-center gap-4 lg:gap-8 ${
              isScrolled ? "text-black" : "text-white"
            }`}
          >
            <a
              href={`tel:${constants.number}`}
              className="hover:text-gray-600 transition-colors flex items-center gap-2"
            >
              <Phone size={18} />
              <span className="hidden lg:inline ">
                {constants.number}
              </span>
            </a>
            <a
              href={`mailto:${constants.email}`}
              className="hover:text-gray-600 transition-colors flex items-center gap-2"
            >
              <Mail size={18} />
              <span className="hidden lg:inline">{constants.email}</span>
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
                className={`${
                  isScrolled ? "bg-white" : "bg-white/10 backdrop-blur-md"
                } border-white/20`}
              >
                {["uz", "ru", "en"].map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`${
                      isScrolled
                        ? "text-black hover:bg-gray-100"
                        : "text-white hover:bg-white/20"
                    } transition-colors`}
                  >
                    {lang.toUpperCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="lg:hidden flex items-center gap-4">
              <button
                onClick={toggleMenu}
                className={`${
                  isScrolled ? "text-black" : "text-white"
                } p-2 hover:bg-gray-200 rounded-full transition-colors`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg lg:hidden"
          >
            <div className="p-4">
              <button
                onClick={toggleMenu}
                className="mb-4 text-black p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <div className="space-y-4">
                {links.map((link, i) => (
                  <motion.div
                    key={link.text}
                    variants={linkVariants}
                    custom={i}
                  >
                    <Link
                      href={link.href}
                      className="block text-black hover:text-gray-600 transition-colors"
                      onClick={toggleMenu}
                    >
                      {link.text}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
