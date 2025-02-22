"use client";
import Hero from "../components/Hero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
//import { useTranslations } from "next-intl";
import Image from "@/components/BluredImage";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const socialLinks = [
  {
    icon: "/Negative.svg",
    href: "https://www.linkedin.com/company/mesmer-llc/",
    label: "LinkedIn",
  },
];

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const Contact = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

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

  const t = useTranslations("contact");
  const location = useTranslations("location");

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
      console.error("Ошибка при отправке:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <Hero
        title={
          t("contacts").toUpperCase().slice(0, 1) +
          t("contacts").toLocaleLowerCase().slice(1)
        }
        subtitle=""
        backgroundImage="/contact.png"
        height="500px"
      />
      <section className="container mx-auto h-[350px] mb-12 px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <motion.div
            className="w-full lg:w-1/2"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[56px] mb-10 font-normal leading-tight text-gray-900">
              {t("title")}
            </h1>

            <div className="flex gap-5 border-b">
              <div className="space-y-8 ">
                <h2 className="text-sm font-medium tracking-wider text-gray-900 uppercase">
                  {t("contacts")}
                </h2>
                <div className="space-y-3">
                  <p className="text-xl text-gray-900">{constants.number}</p>
                  <p className="text-xl text-gray-900">{constants.email}</p>
                  <p>{location("title")}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    className=""
                    aria-label={social.label}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_698_366)">
                        <path
                          d="M20.3715 0H1.62422C0.726172 0 0 0.708984 0 1.58555V20.4102C0 21.2867 0.726172 22 1.62422 22H20.3715C21.2695 22 22 21.2867 22 20.4145V1.58555C22 0.708984 21.2695 0 20.3715 0ZM6.52695 18.7473H3.26133V8.2457H6.52695V18.7473ZM4.89414 6.81484C3.8457 6.81484 2.99922 5.96836 2.99922 4.92422C2.99922 3.88008 3.8457 3.03359 4.89414 3.03359C5.93828 3.03359 6.78477 3.88008 6.78477 4.92422C6.78477 5.96406 5.93828 6.81484 4.89414 6.81484ZM18.7473 18.7473H15.4859V13.6426C15.4859 12.4266 15.4645 10.8582 13.7887 10.8582C12.0914 10.8582 11.8336 12.1859 11.8336 13.5566V18.7473H8.57656V8.2457H11.7047V9.68086H11.7477C12.1816 8.85586 13.2473 7.98359 14.8328 7.98359C18.1371 7.98359 18.7473 10.1578 18.7473 12.9852V18.7473Z"
                          fill="black"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_698_366">
                          <rect width="22" height="22" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="w-full h-[600px] relative mt-12">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2994.282085454949!2d69.25003407610318!3d41.3679556713023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8d5957156a9d%3A0xe6246f9e25d08b2!2z0KPQuy4g0KjQuNGA0L7Qug!5e0!3m2!1sru!2s!4v1738844575214!5m2!1sru!2s"
          className="w-full h-full border-0"
          loading="lazy"
        ></iframe>
      </div>

      <div className="container mx-auto px-4 py-8">
        <p className="text-sm text-gray-600 text-center mb-16">
          {constants.location}
        </p>

        <section className="container mx-auto h-[350px] mb-16 py-8 lg:px-0">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <motion.div
              className="w-full lg:w-1/2"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            ></motion.div>

            <motion.div
              className="w-full lg:w-1/2 space-y-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="w-full mx-auto">
                <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-8 text-center">
                  {t("form.title")}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("form.name")}
                    className="w-full border-gray-300 rounded-none px-4 py-3 text-gray-900 placeholder-gray-500"
                  />
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("form.phone")}
                    className="w-full border-gray-300 rounded-none px-4 py-3 text-gray-900 placeholder-gray-500"
                  />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("form.email")}
                    className="w-full border-gray-300 rounded-none px-4 py-3 text-gray-900 placeholder-gray-500"
                  />
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("form.message")}
                    className="w-full min-h-[120px] border-gray-300 rounded-none px-4 py-3 text-gray-900 placeholder-gray-500"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-[#1A56DB] text-white py-6 rounded-none"
                  >
                    {t("form.send")}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
