"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "@/components/BluredImage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Navbar from "./Navbar";
import { useLocale, useTranslations } from "next-intl";

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
  const pathname = usePathname();

  const t = useTranslations("navbar");
  const locale = useLocale();

  const toggleMenu = () => setIsOpen((prev) => !prev);

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
    { text: t("about"), href: `/${locale}/about` },
    { text: t("services"), href: `/${locale}/services` },
    { text: t("projects"), href: `/${locale}/projects` },
    { text: t("news"), href: `/${locale}/news` },
    { text: t("career"), href: `/${locale}/career` },
    { text: t("contacts"), href: `/${locale}/contact` },
  ];

  return (
    <div
      className="relative bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})`, height }}
    >
      <div className="absolute inset-0   mx-auto bg-black/40 z-10"></div>
      <Navbar />
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-[200px] md:bottom-20 left-0 right-0 md:left-8  text-white z-10 "
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
          className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight  text-center md:text-left max-w-6xl"
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
            <div className="flex flex-col h-full p-6 ">
              <div className="flex justify-between items-center mb-8">
                <Image src="/logo.svg" width={80} height={20} alt="Logo" />
                <button
                  onClick={toggleMenu}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
              {/* <nav className="flex flex-col space-y-6">
                {links.map((link, i) => (
                  <motion.div
                    key={link.text}
                    custom={i}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                  >
                    <Link
                      href={link.href}
                      className={`text-white text-lg hover:text-gray-200 transition-colors ${
                        pathname === link.href ? "font-bold" : ""
                      }`}
                      onClick={toggleMenu}
                    >
                      {link.text}
                    </Link>
                  </motion.div>
                ))}
              </nav> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
