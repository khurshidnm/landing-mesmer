"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Hero = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("UZ");

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const changeLanguage = (lang: string) => setLanguage(lang);

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
    "О компании",
    "Сфера деятельности",
    "Проекты",
    "Новости",
    "Карьера",
    "Контакты",
  ];

  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/heroImg.png')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20"
      >
        <nav className="px-4 lg:px-10 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4 lg:gap-16">
              <div className="text-xl font-bold text-white">
                <Image
                  src="/logo.svg"
                  width={100}
                  height={25}
                  alt="Logo"
                  className="w-[80px] md:w-[100px]"
                />
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex space-x-6">
                {links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Contact Info */}
            <div className="hidden lg:flex items-center gap-8 text-white">
              <a
                href="tel:+998555188870"
                className="hover:text-gray-200 transition-colors flex items-center gap-2"
              >
                <Phone size={18} />
                +998 55 518 88 70
              </a>
              <a
                href="mailto:info@mesmer.uz"
                className="hover:text-gray-200 transition-colors flex items-center gap-2"
              >
                <Mail size={18} />
                info@mesmer.uz
              </a>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-transparent text-white"
                  >
                    {language}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-white">
                  <DropdownMenuItem
                    onClick={() => changeLanguage("UZ")}
                    className="text-gray-900 hover:bg-gray-100 "
                  >
                    UZ
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeLanguage("RU")}
                    className="text-gray-900 hover:bg-gray-100"
                  >
                    RU
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeLanguage("ЎЗ")}
                    className="text-gray-900 hover:bg-gray-100"
                  >
                    ЎЗ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4">
              <a
                href="tel:+998555188870"
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Phone size={20} />
              </a>
              <a
                href="mailto:info@mesmer.uz"
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Mail size={20} />
              </a>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-transparent text-white"
                  >
                    {language}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-white">
                  <DropdownMenuItem
                    onClick={() => changeLanguage("UZ")}
                    className="text-gray-900 hover:bg-gray-100 "
                  >
                    UZ
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeLanguage("RU")}
                    className="text-gray-900 hover:bg-gray-100"
                  >
                    RU
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeLanguage("ЎЗ")}
                    className="text-gray-900 hover:bg-gray-100"
                  >
                    ЎЗ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                onClick={toggleMenu}
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Hero Content */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-[200px] md:bottom-20 left-0 right-0 md:left-8 text-white z-10 px-4 md:px-8"
      >
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl md:text-2xl lg:text-3xl mb-4 text-center md:text-left"
        >
          Специализация в трех рыночных сегментах:
        </motion.p>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight text-center md:text-left max-w-6xl"
        >
          Энергетика, водоснабжение и экологическая инфраструктура
        </motion.h1>
      </motion.section>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 right-0 w-full sm:w-80 h-full bg-black/95 backdrop-blur-md z-50"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <Image src="/logo.svg" width={80} height={20} alt="Logo" />
                <button
                  onClick={toggleMenu}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              <nav className="flex flex-col space-y-6">
                {links.map((link, i) => (
                  <motion.div
                    key={link}
                    custom={i}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                  >
                    <Link
                      href="#"
                      className="text-white text-lg hover:text-gray-200 transition-colors"
                      onClick={toggleMenu}
                    >
                      {link}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto space-y-4">
                <a
                  href="tel:+998555188870"
                  className="flex items-center gap-3 text-white hover:text-gray-200 transition-colors"
                >
                  <Phone size={20} />
                  +998 55 518 88 70
                </a>
                <a
                  href="mailto:info@mesmer.uz"
                  className="flex items-center gap-3 text-white hover:text-gray-200 transition-colors"
                >
                  <Mail size={20} />
                  info@mesmer.uz
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
