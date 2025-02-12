"use client";
import Hero from "../components/Hero";
import {
  TextIcon as Telegram,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";

const socialLinks = [
  { icon: Telegram, href: "#", label: "Telegram" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
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
        title="Контакты"
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
              Свяжитесь с нами
            </h1>

            <div className="flex gap-5 border-b">
              <div className="space-y-8 ">
                <h2 className="text-sm font-medium tracking-wider text-gray-900 uppercase">
                  КОНТАКТЫ
                </h2>
                <div className="space-y-3">
                  <p className="text-xl text-gray-900">{constants.number}</p>
                  <p className="text-xl text-gray-900">{constants.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="text-gray-900 hover:text-gray-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
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


        <section className="container mx-auto h-[350px] mb-16 px-4 py-8 ">
        <div className="flex flex-col lg:flex-row items-start gap-8">
        <motion.div
              className="w-full lg:w-1/2"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            ></motion.div>

<motion.div
              className="w-full lg:w-1/3 space-y-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="w-full mx-auto">
                <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-8 text-center">
                  ЗАПОЛНИТЕ ФОРМУ
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Имя"
                    className="w-full border-gray-300 rounded-none px-4 py-3 text-gray-900 placeholder-gray-500"
                  />
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Номер телефона"
                    className="w-full border-gray-300 rounded-none px-4 py-3 text-gray-900 placeholder-gray-500"
                  />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Электронная почта"
                    className="w-full border-gray-300 rounded-none px-4 py-3 text-gray-900 placeholder-gray-500"
                  />
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Сообщение"
                    className="w-full min-h-[120px] border-gray-300 rounded-none px-4 py-3 text-gray-900 placeholder-gray-500"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-[#1A56DB] text-white py-6 rounded-none"
                  >
                    ОТПРАВИТЬ
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
