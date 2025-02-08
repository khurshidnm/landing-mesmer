"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LinkedinIcon as LinkedIn } from "lucide-react";
import axios from "axios";

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
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-8">КОНТАКТЫ</h2>
            <div className="space-y-6">
              <div>
                <a
                  href="tel:+998555188870"
                  className="text-lg hover:text-blue-400 transition-colors"
                >
                  + 998 (55) 518 88 70
                </a>
              </div>
              <div>
                <a
                  href="mailto:info@mesmer.uz"
                  className="text-lg hover:text-blue-400 transition-colors"
                >
                  info@mesmer.uz
                </a>
              </div>
              <div className="text-gray-400">
                Ташкент, Алмазарский район, улица Широк, 100. Индекс 100069
              </div>
              <div>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  <LinkedIn className="w-6 h-6" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-8">СВЯЖИТЕСЬ С НАМИ</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Имя"
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
                  placeholder="Номер телефона"
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
                  placeholder="Электронная почта"
                  required
                  className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Сообщение"
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
                {isSubmitting ? "Отправка..." : "Отправить"}
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
                href="/about"
                className="hover:text-white transition-colors"
              >
                О компании
              </Link>
              <Link
                href="/services"
                className="hover:text-white transition-colors"
              >
                Услуги
              </Link>
              <Link
                href="/projects"
                className="hover:text-white transition-colors"
              >
                Проекты
              </Link>
              <Link
                href="/careers"
                className="hover:text-white transition-colors"
              >
                Вакансии
              </Link>
              <Link href="/news" className="hover:text-white transition-colors">
                Новости
              </Link>
              <Link
                href="/contacts"
                className="hover:text-white transition-colors"
              >
                Контакты
              </Link>
            </nav>
            <div className="text-right text-sm text-gray-400">
              <p>© 2024 MESMER-EAST LLC</p>
              <div className="mt-2 space-x-4">
                <Link
                  href="/license"
                  className="hover:text-white transition-colors"
                >
                  Предложения по лицензиям
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Правила соглашения
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
