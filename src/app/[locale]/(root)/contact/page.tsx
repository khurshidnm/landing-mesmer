import React from "react";
import Hero from "../components/Hero";
import {
  Facebook,
  Instagram,
  Linkedin,
  Send,
  TextIcon as Telegram,
  Twitter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <div>
      <Hero
        title="Контакты"
        subtitle=""
        backgroundImage="/contact.png"
        height="500px"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2">
            <div className="w-full h-[400px] rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2994.282085454949!2d69.25003407610318!3d41.3679556713023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8d5957156a9d%3A0xe6246f9e25d08b2!2z0KPQuy4g0KjQuNGA0L7Qug!5e0!3m2!1sru!2s!4v1738844575214!5m2!1sru!2s"
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Ташкент, Алмазарский район, улица Широк, 100. Индекс 100069
            </p>
          </div>

          <div className="lg:w-1/2 space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-semibold">Свяжитесь с нами</h2>

              <div className="space-y-2">
                <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
                  КОНТАКТЫ
                </h3>
                <p className="text-lg">+998 (71) 123 45 67</p>
                <p className="text-lg">messmercy@gmail.com</p>
              </div>

              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-2 hover:text-primary transition-colors"
                >
                  <Telegram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 hover:text-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 hover:text-primary transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 hover:text-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 hover:text-primary transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-8">ЗАПОЛНИТЕ ФОРМУ</h2>
              <form className="space-y-6">
                <Input placeholder="Имя" className="w-full" />
                <Input
                  type="tel"
                  placeholder="Номер телефона"
                  className="w-full"
                />
                <Input
                  type="email"
                  placeholder="Электронная почта"
                  className="w-full"
                />
                <Textarea
                  placeholder="Сообщение"
                  className="w-full min-h-[120px]"
                />
                <Button
                  className="w-full bg-[#1A56DB] hover:bg-[#1A56DB]/90 text-white"
                  type="submit"
                >
                  <Send className="w-4 h-4 mr-2" />
                  ОТПРАВИТЬ
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
