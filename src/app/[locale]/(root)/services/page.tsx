"use client";

import Image from "@/components/BluredImage";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="overflow-hidden ">
      <Hero
        title="Услуги"
        subtitle=""
        backgroundImage="/servis.png"
        height="500px"
      />

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <motion.div className="w-full lg:w-1/2"></motion.div>

          <motion.div
            className="w-full lg:w-1/2 space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold">Чем мы занимаемся?</h2>

            <p className="text-gray-700 leading-relaxed">
              "MESMER" в сотрудничестве с дочерними компаниями и международными
              партнерами, готова выступить в качестве генерального подрядчика на
              внутреннем, региональном и международном рынках. Мы предоставляем
              следующий спектр услуг:
            </p>
            <div className="h-[85.07px] relative w-full ">
              <Image
                src="/partners.jpg.svg"
                alt="Company partners"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="w-full h-[300px] relative my-8"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/servishero.png"
          alt="Construction site panorama"
          fill
          className="object-cover"
        />
      </motion.div>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <motion.div className="w-full lg:w-1/2"></motion.div>

          <motion.div
            className="w-full lg:w-1/2 space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">
                "MESMER" предоставляет самые передовые технологии:
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Управленческие навыки мирового класса</li>
                <li>Маркетинг и развитие бизнеса</li>
                <li>Упор на развитие интеллекта</li>
                <li>Разведывательный процесс и результаты исследования</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">
                Инженерно-техническое проектирование
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Инжиниринговая дочерняя компания тесно сотрудничает со своими
                клиентами, создавая группы по проектно-инженерному обеспечению с
                оптимальным сочетанием профессионального навыка и опыта. Наша
                главная цель - найти лучшее решение для разработки проекта,
                удовлетворив при этом все необходимые требования клиента.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Следовательно, наша деятельность включает в себя:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-2">
                <li>
                  Подготовку, оформление и изучение технической документации для
                  тендеров, а также оптимизацию технических условий проектов.
                </li>
                <li>Рассмотрение проектов, выполненных субподрядчиками.</li>
                <li>
                  Проектирование вспомогательного электрического и механического
                  оборудования и предоставление инструкций по производству,
                  монтажу и вводу в эксплуатацию оборудования.
                </li>
              </ul>
            </div>
            <div className="relative w-[600px]  h-[436px]">
              <Image
                src="/servishero5.png"
                alt="Engineering design"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <motion.div
            className="w-full lg:w-1/2 aspect-video relative"
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
            <div>
              <h2 className="text-3xl font-bold mb-4 leading-snug">
                Закупка оборудования
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Закупка/поставка оборудования и инженерно-проектные работы –
                одна из главных составляющих деятельности компании "MESMER". Для
                достижения поставленных целей, мы сотрудничаем с хорошо
                организованной и высококвалифицированной командой профессионалов
                в строительной отрасли, отделом проектирования, управления и
                другими специалистами.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 leading-snug">
                Опираясь на практический опыт, мы несем полную ответственность
                за поставку оборудования:
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Компания «MESMER» обладает более чем десятилетним опытом работы
                в инженерной и строительной отраслях. За это время мы накопили
                богатый опыт и знания, которые позволяют нам гарантировать
                высокое качество наших услуг и продукции. Мы внедрили строгую
                систему контроля качества на всех этапах проекта, от
                проектирования до сдачи объекта в эксплуатацию.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="w-full h-[300px] relative my-8"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/servishero3.jpg.png"
          alt="Construction site panorama"
          fill
          className="object-contain"
        />
      </motion.div>

      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <motion.div className="w-full lg:w-1/2"></motion.div>

            <motion.div
              className="w-full lg:w-1/2 space-y-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Эксплуатация и техническое обслуживание
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Обеспечение безопасности и надежности оборудования играет
                  важную роль при эксплуатации установки. Для достижения этой
                  цели компания "MESMER" предлагает широкий спектр услуг по
                  эксплуатации и техническому обслуживанию на всех этапах
                  проекта - от технико-экономических исследований до
                  проектно-конструкторских работ, инжиниринга, закупок,
                  строительства и коммерческой эксплуатации. "MESMER"
                  предоставляет услуги по эксплуатации и техобслуживанию в
                  соответствии с потребностями своих клиентов, включая
                  подготовку к эксплуатации, такую как планирование, разработка
                  системы и обучение; консультационные услуги, включая
                  оптимизацию прибыли, повышение надежности и безопасности, а
                  также полный спектр услуг по планированию, проведению и
                  эксплуатации различных видов технического обслуживания. Кроме
                  того, посредством сбора и анализа операционных данных можно
                  предвидеть возможные эксплуатационные сбои, которые позволяют
                  нам применять самые передовые технологии для улучшения
                  работоспособности установки и оборудования.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
