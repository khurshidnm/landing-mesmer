"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Hero from "../components/Hero";

const partners = [
  "/our-partners/partner1.png",
  "/our-partners/partner2.png",
  "/our-partners/partner3.png",
  "/our-partners/partner4.png",
  "/our-partners/partner5.png",
  "/our-partners/partner6.png",
  "/our-partners/partner7.png",
  "/our-partners/partner8.png",
  "/our-partners/partner9.png",
  "/our-partners/partner10.png",
  "/our-partners/partner11.png",
  "/our-partners/partner12.png",
  "/our-partners/partner13.png",
  "/our-partners/partner14.png",
  "/our-partners/partner15.png",
  "/our-partners/partner16.png",
  "/our-partners/partner17.png",
  "/our-partners/partner18.png",
  "/our-partners/partner19.png",
  "/our-partners/partner20.png",
  "/our-partners/partner21.png",
];

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="overflow-hidden">
      <Hero
        title="О компании"
        subtitle=""
        backgroundImage="/about.png"
        height="80vh"
      />

      <section className="container mx-auto px-4 py-5">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <motion.div className="w-1/2"></motion.div>

          <motion.div
            className="w-full lg:w-1/2 space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold">Кратко о нас</h2>
            <div className="relative w-full aspect-[16/9]">
              <Image
                src="/about2.png"
                alt="Company icon"
                fill
                className="object-cover w-full "
              />
            </div>
            <p className="text-gray-700 leading-relaxed">
              "MESMER" – многопрофильная компания, предлагающая широкий спектр
              инженерных и коммерческих услуг на международном рынке. Мы
              учитываем индивидуальные потребности клиентов в таких сферах, как
              проектирование, поставка оборудования, строительство и управление
              проектами. Основанная в 2006 году, наша компания объединяет
              квалифицированных специалистов, прошедших обучение и обладающих
              богатым практическим опытом. Мы предлагаем инновационные
              технологические решения, которые применяем в проектах очистки
              питьевой воды, системах канализации, водоснабжения, ирригации и
              мелиорации.
            </p>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="w-full aspect-[21/9] relative my-5"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/about3.png"
          alt="Construction site panorama"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      <section className="container mx-auto px-4 ">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <motion.div className="w-1/2"></motion.div>

          <motion.div
            className="w-full lg:w-1/2 space-y-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">Цели и задачи</h2>
              <div className="relative w-full aspect-[16/9] mb-4">
                <Image
                  src="/about4.png"
                  alt="Goals icon"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-gray-700 leading-relaxed mb-8">
                Мы стремимся оставаться ведущей многопрофильной компанией,
                устанавливая долгосрочные партнерские отношения с клиентами по
                всему миру. Наша миссия — предоставлять инновационные решения,
                соответствующие мировым стандартам, гарантируя высокое качество
                услуг и продукции, максимальную эффективность, технический опыт
                и значительную отдачу от инвестиций.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Честная конкуренция</h2>
              <p className="text-gray-700 leading-relaxed">
                Компания «MESMER» активно участвует в тендерах и конкурсах,
                строго соблюдая принципы честной конкуренции. Мы гарантируем
                прозрачность и открытость в отношениях с конкурентами, клиентами
                и поставщиками. Соблюдение честных стандартов позволяет нам
                укреплять доверие партнеров и обеспечивать справедливую борьбу
                на рынке, что в свою очередь способствует развитию бизнеса и
                достижению долгосрочных целей.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="w-full aspect-[21/9] relative my-5"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/about5.png"
          alt="Construction site panorama"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      <section className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <motion.div
            className="w-full lg:w-1/2 aspect-[4/3] relative"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          ></motion.div>

          <motion.div
            className="w-full lg:w-1/2 "
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div>
              <h2 className="text-3xl font-bold mb-4 leading-snug">
                Сотрудничество с поставщиками, партнерами и клиентами
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Компания «MESMER» придерживается высоких этических стандартов,
                строго соблюдая все договорные обязательства и обеспечивая
                прозрачность во всех отношениях с партнерами и клиентами. Мы
                ценим долгосрочные отношения и стремимся к взаимовыгодному
                сотрудничеству, основанному на доверии и взаимном уважении.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 leading-snug">
                Контроль качества
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Компания «MESMER» обладает более чем десятилетним опытом работы
                в инженерной и строительной отраслях. За это время мы накопили
                богатый опыт и знания, которые позволяют нам гарантировать
                высокое качество наших услуг и продукции. Мы внедрили строгую
                систему контроля качества на всех этапах проекта, от
                проектирования до сдачи объекта в эксплуатацию.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed mb-4">
                <li>Регулярные проверки на соответствие стандартам качества</li>
                <li>Использование передовых технологий и оборудования</li>
                <li>Квалифицированный персонал с богатым опытом работы</li>
                <li>Строгий контроль за использованием материалов</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Успех компании зависит от слаженной работы всей команды, поэтому
                мы постоянно инвестируем в развитие наших сотрудников и
                совершенствование наших процессов. Мы стремимся к постоянному
                улучшению качества наших услуг и продукции, чтобы удовлетворить
                потребности наших клиентов и превзойти их ожидания.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-5 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start ">
            <motion.div className="w-1/2"></motion.div>
            <motion.div
              className="w-full lg:w-1/2  mb-5"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-6">Наши партнеры</h2>
              <p className="text-gray-700 leading-relaxed">
                «MESMER» сотрудничает с ведущими мировыми технологическими и
                инженерными компаниями, что позволяет нам предлагать клиентам
                самые передовые решения и гарантировать высокое качество наших
                услуг. Мы гордимся нашими партнерами и ценим их вклад в наш
                общий успех.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0 border border-collapse rounded-lg overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {partners.map((partner, index) => (
              <div
                key={index}
                className="relative aspect-square border p-4 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={partner || "/placeholder.svg"}
                    alt={`Partner ${index + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
