"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const Footer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [constants, setConstants] = useState({
    number: "+ 998 (55) 518 88 70",
    email: "info@mesmer.uz",
    location: "Ташкент, Алмазарский район, улица Широк, 100. Индекс 100069",
  });

  const contactsLang = useTranslations("contact");
  const navbarLang = useTranslations("navbar");
  const location = useTranslations("location");
  const locale = useLocale();

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
    fetchConstants();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const BOT_TOKEN = "7049223832:AAH0qBWpoDVAWiCbMxH92HTNcC3JQ2zbHS4";
      const CHAT_ID = -1002471201680;

      const message = `📨 Новая заявка!\n\n👤 Имя: ${formData.name}\n📞 Телефон: ${formData.phone}\n📧 Email: ${formData.email}\n💬 Сообщение: ${formData.message}`;

      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      });

      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-8">{contactsLang("title")}</h2>
            <div className="space-y-6">
              <div>
                <a
                  href="tel:+998555188870"
                  className="text-lg hover:text-blue-400 transition-colors"
                >
                  {constants.number}
                </a>
              </div>
              <div>
                <a
                  href="mailto:info@mesmer.uz"
                  className="text-lg hover:text-blue-400 transition-colors"
                >
                  {constants.email}
                </a>
              </div>

              <div className="text-gray-400">{constants.location}</div>

              <div className="flex gap-3">
                <img
                  src={"/Negative.svg"}
                  alt=""
                  className="text-white"
                  width={22}
                  height={22}
                />
                <a href="https://www.linkedin.com/company/mesmer-llc/">
                  LinkedIn
                </a>
              </div>
              <div>
                <p>{location("title")}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-8">
              {navbarLang("contact_title")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={contactsLang("form.name")}
                  required
                  className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={contactsLang("form.phone")}
                  required
                  className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={contactsLang("form.email")}
                  required
                  className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={contactsLang("form.message")}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? navbarLang("sending") : navbarLang("send")}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
            <div>
              <Image
                src="/logo.svg"
                alt="Mesmer Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-3 justify-center text-sm text-gray-400">
              <Link
                href={`/${locale}/about`}
                className="hover:text-white transition-colors"
              >
                {navbarLang("about")}
              </Link>
              <Link
                href={`/${locale}/services`}
                className="hover:text-white transition-colors"
              >
                {navbarLang("services")}
              </Link>
              <Link
                href={`/${locale}/projects`}
                className="hover:text-white transition-colors"
              >
                {navbarLang("projects")}
              </Link>
              <Link
                href={`/${locale}/career`}
                className="hover:text-white transition-colors"
              >
                {navbarLang("career")}
              </Link>
              <Link
                href={`/${locale}/news`}
                className="hover:text-white transition-colors"
              >
                {navbarLang("news")}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="hover:text-white transition-colors"
              >
                {navbarLang("contacts")}
              </Link>
            </nav>
            <div className="text-right text-sm text-gray-400">
              <p>© 2025 MESMER-EAST LLC</p>

              {/*
              <div className="mt-2 space-x-4">
                
                <div className="hover:text-white transition-colors">
                  <a href="/MESMER RULES.pdf">{navbarLang("license")}</a>
                </div>
                <div className="hover:text-white transition-colors">
                  <a href="/MESMER RULES.pdf"> {navbarLang("rules")}</a>
                </div> 
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
