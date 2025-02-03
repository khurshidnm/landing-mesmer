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

const Hero = ({
  backgroundImage,
  height,
  title,
  subtitle,
}: {
  backgroundImage: string;
  height: string;
  title: string;
  subtitle: string;
}) => {
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
      className="relative bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})`, height }}
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
            <div className="flex items-center gap-4 lg:gap-16">
              <Image
                src="/logo.svg"
                width={100}
                height={25}
                alt="Logo"
                className="w-[80px] md:w-[100px]"
              />
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
            <div className="flex items-center gap-4 lg:gap-8 text-white">
              {/* Телефон */}
              <a
                href="tel:+998555188870"
                className="hover:text-gray-200 transition-colors flex items-center gap-2"
              >
                <Phone size={18} />
                <span className="hidden lg:inline">+998 55 518 88 70</span>
              </a>
              {/* Почта */}
              <a
                href="mailto:info@mesmer.uz"
                className="hover:text-gray-200 transition-colors flex items-center gap-2"
              >
                <Mail size={18} />
                <span className="hidden lg:inline">info@mesmer.uz</span>
              </a>
              {/* Выбор языка */}
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
                  {["UZ", "RU", "ЎЗ"].map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      {lang}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Кнопка меню для мобильных устройств */}
              <div className="lg:hidden flex items-center gap-4">
                <button
                  onClick={toggleMenu}
                  className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>
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
          {subtitle}
        </motion.p>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight text-center md:text-left max-w-6xl"
        >
          {title}
        </motion.h1>
      </motion.section>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
