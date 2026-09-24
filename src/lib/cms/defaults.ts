// Default content for the Website Content collections (spec sections 4–5).
// Pages fall back to these until an admin loads them into the database
// ("Load default content" in the admin panel) and edits them there.

import type { CollectionKey } from "./definitions";
import { PAGE_DEFAULTS } from "./defaults-pages";

type DefaultEntry = {
  /** Stable key used to link children to parents before real ids exist */
  key: string;
  parent_key?: string;
  enabled?: boolean;
  data: Record<string, unknown>;
};

const i18n = (en: string, ru: string, uz: string) => ({ en, ru, uz });

const menu = (
  key: string,
  label: ReturnType<typeof i18n>,
  href: string,
  parent_key?: string,
  enabled = true
): DefaultEntry => ({ key, parent_key, enabled, data: { label, href } });

const INTERNATIONAL = "/projects?financier=adb,ebrd,world-bank,afd,isdb,adfd";
const MESAL = "/group/mesal-water-technologies";

export const CMS_DEFAULTS: Record<CollectionKey, DefaultEntry[]> = {
  menu: [
    menu("about", i18n("About Us", "О компании", "Kompaniya haqida"), "/about"),
    menu("about-company", i18n("Company", "Компания", "Kompaniya"), "/about", "about"),
    // No content for these yet: enable once the sections exist on the About page
    menu("about-history", i18n("Our History", "Наша история", "Tariximiz"), "/about#history", "about", false),
    menu("about-management", i18n("Management", "Руководство", "Rahbariyat"), "/about#management", "about", false),
    menu("about-certificates", i18n("Certificates", "Сертификаты", "Sertifikatlar"), "/about#certificates", "about"),
    menu("about-sustainability", i18n("Sustainability", "Устойчивое развитие", "Barqaror rivojlanish"), "/about#sustainability", "about", false),

    menu("expertise", i18n("Expertise", "Экспертиза", "Ekspertiza"), "/expertise"),
    menu("exp-wt", i18n("Water Treatment", "Водоподготовка", "Suv tozalash"), "/expertise/water-treatment", "expertise"),
    menu("exp-ww", i18n("Wastewater Treatment", "Очистка сточных вод", "Oqova suvlarni tozalash"), "/expertise/wastewater-treatment", "expertise"),
    menu("exp-ws", i18n("Water Supply", "Водоснабжение", "Suv ta’minoti"), "/expertise/water-supply", "expertise"),
    menu("exp-irr", i18n("Irrigation", "Ирригация", "Irrigatsiya"), "/expertise/irrigation", "expertise"),
    menu("exp-eng", i18n("Engineering", "Инжиниринг", "Muhandislik"), "/expertise/engineering-epc", "expertise"),
    menu("exp-epc", i18n("EPC & O&M", "EPC и эксплуатация", "EPC va ekspluatatsiya"), "/expertise/engineering-epc", "expertise"),

    menu("projects", i18n("Projects", "Проекты", "Loyihalar"), "/projects"),
    menu("prj-all", i18n("All Projects", "Все проекты", "Barcha loyihalar"), "/projects", "projects"),
    menu("prj-water", i18n("Water", "Вода", "Suv"), "/projects?category=water-treatment,water-supply", "projects"),
    menu("prj-ww", i18n("Wastewater", "Водоотведение", "Oqova suv"), "/projects?category=wastewater", "projects"),
    menu("prj-infra", i18n("Infrastructure", "Инфраструктура", "Infratuzilma"), "/projects?category=irrigation,infrastructure", "projects"),
    menu("prj-intl", i18n("International Projects", "Международные проекты", "Xalqaro loyihalar"), INTERNATIONAL, "projects"),

    menu("equipment", i18n("Equipment", "Оборудование", "Uskunalar"), MESAL),
    menu("eq-mesal", i18n("MESAL Water Technologies", "MESAL Water Technologies", "MESAL Water Technologies"), MESAL, "equipment"),
    menu("eq-equipment", i18n("Equipment", "Оборудование", "Uskunalar"), MESAL, "equipment"),
    menu("eq-manufacturing", i18n("Manufacturing", "Производство", "Ishlab chiqarish"), MESAL, "equipment"),

    menu("group", i18n("MESMER Group", "Группа MESMER", "MESMER Group"), "/group"),
    menu("grp-mesal", i18n("MESAL", "MESAL", "MESAL"), MESAL, "group"),
    menu("grp-maxsus", i18n("Maxsus Suv Qurilish Invest", "Maxsus Suv Qurilish Invest", "Maxsus Suv Qurilish Invest"), "/group/maxsus-suv-qurilish-invest", "group"),
    menu("grp-sarbon", i18n("Sarbon University", "Sarbon University", "Sarbon University"), "/group/sarbon-university", "group"),

    menu("news", i18n("News & Insights", "Новости", "Yangiliklar"), "/news"),

    menu("careers", i18n("Careers", "Карьера", "Karyera"), "/career"),
    menu("car-eng", i18n("Engineering", "Инжиниринг", "Muhandislik"), "/career?category=engineering", "careers"),
    menu("car-pm", i18n("Project Management", "Управление проектами", "Loyihalarni boshqarish"), "/career?category=project-management", "careers"),
    menu("car-om", i18n("O&M", "Эксплуатация (O&M)", "Ekspluatatsiya (O&M)"), "/career?category=om", "careers"),
    menu("car-all", i18n("View Vacancies", "Все вакансии", "Barcha vakansiyalar"), "/career#vacancies", "careers"),

    menu("contact", i18n("Contact", "Контакты", "Aloqa"), "/contact"),
  ],

  hero: [
    {
      key: "hero",
      data: {
        brand: "MESMER",
        tagline: i18n(
          "Engineering · Procurement · Construction · Operation",
          "Инжиниринг · Закупки · Строительство · Эксплуатация",
          "Muhandislik · Xaridlar · Qurilish · Ekspluatatsiya"
        ),
        title: i18n(
          "ENGINEERING WATER. BUILDING THE FUTURE.",
          "ИНЖИНИРИНГ ВОДЫ. СТРОИМ БУДУЩЕЕ.",
          "SUV MUHANDISLIGI. KELAJAKNI BUNYOD ETAMIZ."
        ),
        subtitle: i18n(
          "Integrated EPC and O&M solutions for water, wastewater and environmental infrastructure across Central Asia. Since 2003.",
          "Комплексные EPC- и O&M-решения для водоснабжения, водоотведения и экологической инфраструктуры в Центральной Азии. С 2003 года.",
          "Markaziy Osiyoda suv ta’minoti, oqova suv va ekologik infratuzilma uchun kompleks EPC va O&M yechimlari. 2003-yildan beri."
        ),
        primary_label: i18n("Our Projects", "Наши проекты", "Loyihalarimiz"),
        primary_href: "/projects",
        secondary_label: i18n("Contact Us", "Связаться с нами", "Biz bilan bog‘lanish"),
        secondary_href: "/contact",
        background: "/hero.png",
      },
    },
  ],

  stats: [
    {
      key: "years",
      data: {
        value: "20+",
        label: i18n("Years", "Лет опыта", "Yillik tajriba"),
        description: i18n(
          "years of engineering & construction",
          "лет в инжиниринге и строительстве",
          "yillik muhandislik va qurilish tajribasi"
        ),
        show_in_hero: true,
      },
    },
    {
      key: "projects",
      data: {
        value: "30+",
        label: i18n("Projects", "Проектов", "Loyiha"),
        description: i18n(
          "projects completed & ongoing",
          "реализованных и текущих проектов",
          "tugallangan va amalga oshirilayotgan loyihalar"
        ),
        show_in_hero: true,
      },
    },
    {
      key: "professionals",
      data: {
        value: "1,000+",
        label: i18n("Professionals", "Специалистов", "Mutaxassis"),
        description: i18n(
          "professionals across the group",
          "специалистов в группе компаний",
          "guruh kompaniyalaridagi mutaxassislar"
        ),
        show_in_hero: true,
      },
    },
    {
      key: "pipelines",
      data: {
        value: "2,000+ km",
        label: i18n("Pipelines", "Трубопроводов", "Quvurlar"),
        description: i18n("pipelines installed", "проложенных трубопроводов", "yotqizilgan quvurlar"),
        show_in_hero: true,
      },
    },
    {
      key: "people",
      data: {
        value: "1.5M+",
        label: i18n("People served", "Жителей", "Aholi"),
        description: i18n(
          "people served by WWTP projects",
          "жителей обслуживают наши очистные сооружения",
          "aholiga oqova suv tozalash inshootlarimiz xizmat ko‘rsatadi"
        ),
        show_in_hero: false,
      },
    },
    {
      key: "capacity",
      data: {
        value: "500,000+ m³/day",
        label: i18n("Treatment capacity", "Мощность очистки", "Tozalash quvvati"),
        description: i18n(
          "treatment capacity, ongoing projects",
          "мощность очистки в текущих проектах",
          "amalga oshirilayotgan loyihalardagi tozalash quvvati"
        ),
        show_in_hero: false,
      },
    },
  ],

  expertise: [
    {
      key: "water-treatment",
      data: {
        slug: "water-treatment",
        title: i18n("Water Treatment", "Водоподготовка", "Suv tozalash"),
        summary: i18n(
          "Design, construction and rehabilitation of water treatment plants (WTP) that deliver safe drinking water to cities and districts.",
          "Проектирование, строительство и реконструкция водоочистных станций (ВОС), обеспечивающих города и районы качественной питьевой водой.",
          "Shahar va tumanlarni sifatli ichimlik suvi bilan ta’minlaydigan suv tozalash inshootlarini (WTP) loyihalash, qurish va rekonstruksiya qilish."
        ),
        services: {
          en: ["WTP design & construction", "Water intake facilities", "Pumping stations", "Transmission pipelines"],
          ru: ["Проектирование и строительство ВОС", "Водозаборные сооружения", "Насосные станции", "Магистральные водоводы"],
          uz: ["WTP loyihalash va qurish", "Suv olish inshootlari", "Nasos stansiyalari", "Magistral suv quvurlari"],
        },
        image: "/api/uploads/project_30_20260512061709180.jpg",
        project_category: "water-treatment",
        featured: true,
      },
    },
    {
      key: "wastewater-treatment",
      data: {
        slug: "wastewater-treatment",
        title: i18n("Wastewater Treatment", "Очистка сточных вод", "Oqova suvlarni tozalash"),
        summary: i18n(
          "Municipal and industrial wastewater treatment plants (WWTP) built to international effluent standards.",
          "Городские и промышленные очистные сооружения канализации (КОС), соответствующие международным нормам очистки.",
          "Xalqaro tozalash me’yorlariga javob beradigan shahar va sanoat oqova suv tozalash inshootlari (WWTP)."
        ),
        services: {
          en: ["Municipal & industrial WWTP", "Biological treatment", "MBR systems", "Sludge treatment"],
          ru: ["Городские и промышленные КОС", "Биологическая очистка", "Мембранные биореакторы (MBR)", "Обработка осадка"],
          uz: ["Shahar va sanoat WWTP", "Biologik tozalash", "MBR tizimlari", "Cho‘kmani qayta ishlash"],
        },
        image: "/api/uploads/project-22_20260422130648948.jpg",
        project_category: "wastewater",
        featured: true,
      },
    },
    {
      key: "water-supply",
      data: {
        slug: "water-supply",
        title: i18n("Water Supply & Networks", "Водоснабжение и сети", "Suv ta’minoti va tarmoqlar"),
        summary: i18n(
          "Transmission mains, distribution networks and house connections that bring reliable water supply to every household.",
          "Магистральные водоводы, распределительные сети и подключения домов для надёжного водоснабжения каждого домохозяйства.",
          "Har bir xonadonni ishonchli suv bilan ta’minlaydigan magistral quvurlar, taqsimot tarmoqlari va uy ulanishlari."
        ),
        services: {
          en: ["Transmission mains", "Distribution networks", "House connections", "Reservoirs"],
          ru: ["Магистральные водоводы", "Распределительные сети", "Подключения домов", "Резервуары"],
          uz: ["Magistral quvurlar", "Taqsimot tarmoqlari", "Uy ulanishlari", "Suv omborlari"],
        },
        image: "/heroIm.png",
        project_category: "water-supply",
        featured: true,
      },
    },
    {
      key: "irrigation",
      data: {
        slug: "irrigation",
        title: i18n("Irrigation", "Ирригация", "Irrigatsiya"),
        summary: i18n(
          "Canals, pumping stations and hydraulic structures for agriculture and regional water management.",
          "Каналы, насосные станции и гидротехнические сооружения для сельского хозяйства и управления водными ресурсами.",
          "Qishloq xo‘jaligi va suv resurslarini boshqarish uchun kanallar, nasos stansiyalari va gidrotexnik inshootlar."
        ),
        services: {
          en: ["Irrigation canals", "Pumping stations", "Hydraulic structures", "Canal rehabilitation"],
          ru: ["Оросительные каналы", "Насосные станции", "Гидротехнические сооружения", "Реконструкция каналов"],
          uz: ["Sug‘orish kanallari", "Nasos stansiyalari", "Gidrotexnik inshootlar", "Kanallarni rekonstruksiya qilish"],
        },
        image: "/projects.jpg.png",
        project_category: "irrigation",
        featured: false,
      },
    },
    {
      key: "engineering-epc",
      data: {
        slug: "engineering-epc",
        title: i18n("Engineering & EPC", "Инжиниринг и EPC", "Muhandislik va EPC"),
        summary: i18n(
          "Full project lifecycle under one contract: design, procurement, construction, commissioning and operation.",
          "Полный цикл проекта по одному контракту: проектирование, закупки, строительство, пусконаладка и эксплуатация.",
          "Loyihaning to‘liq sikli bitta shartnoma asosida: loyihalash, xaridlar, qurilish, ishga tushirish va ekspluatatsiya."
        ),
        services: {
          en: ["Design", "Procurement", "Construction", "Commissioning", "O&M"],
          ru: ["Проектирование", "Закупки", "Строительство", "Пусконаладка", "Эксплуатация (O&M)"],
          uz: ["Loyihalash", "Xaridlar", "Qurilish", "Ishga tushirish", "Ekspluatatsiya (O&M)"],
        },
        image: "/about4.png",
        project_category: "",
        featured: true,
      },
    },
  ],

  financiers: [
    { key: "adb", data: { slug: "adb", name: "ADB", full_name: i18n("Asian Development Bank", "Азиатский банк развития", "Osiyo taraqqiyot banki"), logo: "/partners/financiers/adb.png" } },
    { key: "ebrd", data: { slug: "ebrd", name: "EBRD", full_name: i18n("European Bank for Reconstruction and Development", "Европейский банк реконструкции и развития", "Yevropa tiklanish va taraqqiyot banki"), logo: "/partners/financiers/ebrd.png" } },
    { key: "world-bank", data: { slug: "world-bank", name: "World Bank", full_name: i18n("World Bank", "Всемирный банк", "Jahon banki"), logo: "/partners/financiers/world-bank.png" } },
    { key: "afd", data: { slug: "afd", name: "AFD", full_name: i18n("French Development Agency (AFD)", "Французское агентство развития (AFD)", "Fransiya taraqqiyot agentligi (AFD)"), logo: "/partners/financiers/afd.png" } },
    { key: "isdb", data: { slug: "isdb", name: "IsDB", full_name: i18n("Islamic Development Bank", "Исламский банк развития", "Islom taraqqiyot banki"), logo: "/partners/financiers/isdb.png" } },
    { key: "adfd", data: { slug: "adfd", name: "Abu Dhabi Fund", full_name: i18n("Abu Dhabi Fund for Development", "Абу-Дабийский фонд развития", "Abu-Dabi taraqqiyot jamg‘armasi"), logo: "/partners/financiers/adfd.png" } },
  ],

  // Sources: mesmer.uz news, mesal.uz, msqi.uz, sarbon.university (September 2026)
  group_companies: [
    {
      key: "mesmer-engineering",
      data: {
        slug: "mesmer-engineering",
        name: "MESMER Engineering",
        tagline: i18n("EPC · Construction · Project Management", "EPC · Строительство · Управление проектами", "EPC · Qurilish · Loyihalarni boshqarish"),
        description: i18n(
          "MESMER Engineering (MESMER-EAST LLC) is the group’s EPC contractor. It designs, procures, builds and commissions water supply, wastewater and environmental infrastructure across Uzbekistan and Central Asia.\n\nIts portfolio includes water and wastewater treatment plants, trunk mains, water intakes and irrigation pumping stations, many of them financed by ADB, EBRD, the World Bank, AFD and the Abu Dhabi Fund for Development.",
          "MESMER Engineering (ООО «MESMER-EAST») — EPC-подрядчик группы. Компания проектирует, поставляет оборудование, строит и вводит в эксплуатацию объекты водоснабжения, водоотведения и экологической инфраструктуры в Узбекистане и Центральной Азии.\n\nВ портфеле — водоочистные и канализационные очистные сооружения, магистральные водоводы, водозаборы и ирригационные насосные станции, в том числе проекты, финансируемые АБР, ЕБРР, Всемирным банком, AFD и Абу-Дабийским фондом развития.",
          "MESMER Engineering (MESMER-EAST MChJ) — guruhning EPC pudratchisi. Kompaniya O‘zbekiston va Markaziy Osiyoda suv ta’minoti, oqova suv va ekologik infratuzilma obyektlarini loyihalaydi, uskunalar bilan ta’minlaydi, quradi va ishga tushiradi.\n\nPortfelda suv va oqova suv tozalash inshootlari, magistral quvurlar, suv olish inshootlari va irrigatsiya nasos stansiyalari bor, ularning ko‘pchiligi OTB, EBRD, Jahon banki, AFD va Abu-Dabi taraqqiyot jamg‘armasi tomonidan moliyalashtirilgan."
        ),
        facts: {
          en: [
            "Ranked among Uzbekistan’s top 5 ADB contractors for 2021–2025",
            "Among the 20 largest taxpayers in Uzbekistan’s construction sector in 2025",
            "ISO 9001, ISO 14001 and ISO 45001 certified by TÜV AUSTRIA",
            "Authorized Engineering Partner of Siemens — the only one in Uzbekistan specialising in water and wastewater",
          ],
          ru: [
            "Входит в топ-5 подрядчиков АБР в Узбекистане за 2021–2025 годы",
            "Входит в топ-20 крупнейших налогоплательщиков строительной отрасли Узбекистана за 2025 год",
            "Сертифицирована по ISO 9001, ISO 14001 и ISO 45001 (TÜV AUSTRIA)",
            "Авторизованный инжиниринговый партнёр Siemens — единственный в Узбекистане в сфере водоснабжения и водоотведения",
          ],
          uz: [
            "2021–2025-yillarda O‘zbekistondagi eng yaxshi 5 ta OTB pudratchisi qatorida",
            "2025-yilda O‘zbekiston qurilish sohasidagi eng yirik 20 ta soliq to‘lovchi qatorida",
            "ISO 9001, ISO 14001 va ISO 45001 sertifikatlari (TÜV AUSTRIA)",
            "Siemensning vakolatli muhandislik hamkori — O‘zbekistonda suv va oqova suv sohasidagi yagona hamkor",
          ],
        },
        logo: "/partners/group/mesmer-engineering.png",
        website: "https://mesmer.uz",
        address: i18n(
          "Shiroq street 100, Almazar district, Tashkent 100069, Uzbekistan",
          "Узбекистан, 100069, Ташкент, Алмазарский район, ул. Широк, 100",
          "O‘zbekiston, 100069, Toshkent, Olmazor tumani, Shiroq ko‘chasi, 100"
        ),
        phone: "+998 55 518 88 70",
        email: "info@mesmer.uz",
        page_href: "/about",
      },
    },
    {
      key: "mesal-water-technologies",
      data: {
        slug: "mesal-water-technologies",
        name: "MESAL Water Technologies",
        tagline: i18n(
          "Water & wastewater treatment equipment manufacturer",
          "Производство оборудования для водоподготовки и очистки стоков",
          "Suv va oqova suv tozalash uskunalari ishlab chiqaruvchisi"
        ),
        description: i18n(
          "MESAL Water Technologies is a Turkish–Uzbek joint venture in Yangiyul district, Tashkent region. It designs and manufactures equipment for water treatment (WTP) and wastewater treatment (WWTP) plants, and supplies, installs and reconstructs water pipelines.\n\nThe plant produces more than thirty types of specialised units, including sluice and flow-control gates for water supply, irrigation and treatment plants. MESAL is also the official dealer of Sulzer in Uzbekistan.",
          "MESAL Water Technologies — турецко-узбекское совместное предприятие в Янгиюльском районе Ташкентской области. Компания разрабатывает и производит оборудование для водоочистных (ВОС) и канализационных очистных сооружений (КОС), а также поставляет, монтирует и реконструирует водопроводные магистрали.\n\nПредприятие выпускает более тридцати видов специализированных установок, в том числе шиберные и водорегулирующие затворы для водоснабжения, ирригации и очистных сооружений. MESAL также является официальным дилером Sulzer в Узбекистане.",
          "MESAL Water Technologies — Toshkent viloyati Yangiyo‘l tumanidagi turk-o‘zbek qo‘shma korxonasi. Kompaniya suv tozalash (WTP) va oqova suv tozalash (WWTP) inshootlari uchun uskunalar ishlab chiqadi va tayyorlaydi, shuningdek suv quvurlarini yetkazib beradi, o‘rnatadi va rekonstruksiya qiladi.\n\nKorxona o‘ttizdan ortiq turdagi maxsus qurilmalar, jumladan suv ta’minoti, irrigatsiya va tozalash inshootlari uchun shiberli va suv rostlovchi zatvorlar ishlab chiqaradi. MESAL O‘zbekistonda Sulzer kompaniyasining rasmiy dileri hamdir."
        ),
        facts: {
          en: [
            "30+ types of specialised units and equipment for treatment plants",
            "US$1.7 million invested; energy-saving technology from China, Germany and Turkey",
            "Supplies the Tashkent Region water supply and sewerage project in Chirchik, Almalyk, Angren and Bekabad",
            "Official dealer of Sulzer in Uzbekistan",
          ],
          ru: [
            "Более 30 видов специализированных установок и оборудования для очистных сооружений",
            "Инвестиции — 1,7 млн долларов США; энергосберегающие технологии из Китая, Германии и Турции",
            "Поставки для проекта водоснабжения и канализации Ташкентской области в Чирчике, Алмалыке, Ангрене и Бекабаде",
            "Официальный дилер Sulzer в Узбекистане",
          ],
          uz: [
            "Tozalash inshootlari uchun 30 dan ortiq turdagi maxsus qurilma va uskunalar",
            "1,7 mln AQSh dollari investitsiya; Xitoy, Germaniya va Turkiyaning energiya tejovchi texnologiyalari",
            "Toshkent viloyati suv ta’minoti va kanalizatsiya loyihasi uchun Chirchiq, Olmaliq, Angren va Bekoboddagi yetkazib berishlar",
            "O‘zbekistonda Sulzer kompaniyasining rasmiy dileri",
          ],
        },
        logo: "/partners/group/mesal-water-technologies.png",
        website: "https://mesal.uz",
        address: i18n(
          "Temuriy street 15, Yangiyul, Tashkent region 100069, Uzbekistan",
          "Узбекистан, 100069, Ташкентская область, г. Янгиюль, ул. Темурий, 15",
          "O‘zbekiston, 100069, Toshkent viloyati, Yangiyo‘l shahri, Temuriy ko‘chasi, 15"
        ),
        phone: "+998 71 501 01 07",
        email: "info@mesal.uz",
        page_href: "",
      },
    },
    {
      key: "maxsus-suv-qurilish-invest",
      data: {
        slug: "maxsus-suv-qurilish-invest",
        name: "Maxsus Suv Qurilish Invest",
        tagline: i18n(
          "Precast concrete · TEXNOPIPE polyethylene pipes",
          "Железобетонные изделия · полиэтиленовые трубы TEXNOPIPE",
          "Temir-beton buyumlar · TEXNOPIPE polietilen quvurlari"
        ),
        description: i18n(
          "Maxsus Suv Qurilish Invest LLC manufactures reinforced concrete products and polyethylene pipes under the TEXNOPIPE brand for construction, utility and infrastructure projects, supplying customers across Uzbekistan and the CIS.\n\nThe company handles wholesale and project orders and produces to order, matching volumes, lead times and project specifications. Product samples are on display at its sales office in Samarkand.",
          "ООО «Maxsus Suv Qurilish Invest» производит железобетонные изделия и полиэтиленовые трубы под торговой маркой TEXNOPIPE для строительных, инженерных и инфраструктурных объектов и поставляет продукцию по Узбекистану и странам СНГ.\n\nКомпания работает с оптовыми и проектными заказами и выпускает продукцию под заказ с учётом объёмов, сроков и спецификаций объекта. Образцы продукции представлены в офисе продаж в Самарканде.",
          "«Maxsus Suv Qurilish Invest» MChJ qurilish, muhandislik va infratuzilma obyektlari uchun temir-beton buyumlar hamda TEXNOPIPE savdo belgisi ostida polietilen quvurlar ishlab chiqaradi va O‘zbekiston hamda MDH davlatlariga yetkazib beradi.\n\nKompaniya ulgurji va loyiha buyurtmalari bilan ishlaydi, hajm, muddat va obyekt talablariga mos ravishda buyurtma asosida ishlab chiqaradi. Mahsulot namunalari Samarqanddagi savdo ofisida namoyish etilgan."
        ),
        facts: {
          en: [
            "1,000+ km of polyethylene pipes produced every month",
            "500+ tonnes of precast concrete products per month",
            "2 production plants; 15+ years on the market",
            "ISO 9001:2015 certified; pipes made only from virgin PE80/PE100",
            "Pressure pipes meet GOST 54475-2011 and GOST 8020-90, with a service life of up to 50 years",
          ],
          ru: [
            "Более 1 000 км полиэтиленовых труб ежемесячно",
            "Более 500 тонн железобетонных изделий в месяц",
            "2 производственных завода; более 15 лет на рынке",
            "Производство сертифицировано по ISO 9001:2015; трубы только из первичного ПЭ80/ПЭ100",
            "Напорные трубы по ГОСТ 54475-2011 и ГОСТ 8020-90 со сроком службы до 50 лет",
          ],
          uz: [
            "Har oyda 1 000 km dan ortiq polietilen quvurlar",
            "Oyiga 500 tonnadan ortiq temir-beton buyumlar",
            "2 ta ishlab chiqarish zavodi; bozorda 15 yildan ortiq",
            "ISO 9001:2015 sertifikati; quvurlar faqat birlamchi PE80/PE100 xomashyosidan",
            "Bosimli quvurlar GOST 54475-2011 va GOST 8020-90 ga mos, xizmat muddati 50 yilgacha",
          ],
        },
        logo: "/partners/group/maxsus-suv-qurilish-invest.png",
        website: "https://msqi.uz",
        address: i18n(
          "Orbuyro 50, Kaynama mahalla, Samarkand district, Samarkand region, Uzbekistan",
          "Узбекистан, Самаркандская область, Самаркандский район, махалля Кайнама, Орбуйро, 50",
          "O‘zbekiston, Samarqand viloyati, Samarqand tumani, Qaynama mahallasi, Orbuyro, 50"
        ),
        phone: "+998 55 707 03 10",
        email: "info@msqi.uz",
        page_href: "",
      },
    },
    {
      key: "sarbon-university",
      data: {
        slug: "sarbon-university",
        name: "Sarbon University",
        tagline: i18n(
          "University in Tashkent · 34 study programmes",
          "Университет в Ташкенте · 34 направления обучения",
          "Toshkentdagi universitet · 34 ta ta’lim yo‘nalishi"
        ),
        description: i18n(
          "Sarbon University is a university in the Olmazor district of Tashkent. Its mission is to educate specialists who think critically and use their knowledge to improve their own lives and the lives of others.\n\nProgrammes include Construction Engineering and Architecture, Computer Engineering and IT, Economics and Business, Law, Public Administration, International Relations, Psychology and Philology. The university works with international partners including Jiangsu Normal University, Woosong University’s iDegree programme and the British Council.",
          "Sarbon University — университет в Алмазарском районе Ташкента. Его миссия — готовить специалистов, способных критически мыслить и своими знаниями улучшать собственную жизнь и жизнь окружающих.\n\nСреди направлений — строительная инженерия и архитектура, компьютерная инженерия и IT, экономика и бизнес, юриспруденция, государственное управление, международные отношения, психология и филология. Университет сотрудничает с международными партнёрами, в том числе с Педагогическим университетом Цзянсу, программой iDegree Университета Усон и Британским советом.",
          "Sarbon universiteti — Toshkentning Olmazor tumanidagi universitet. Uning maqsadi — tanqidiy fikrlay oladigan, o‘z bilimi bilan o‘zining va atrofdagilarning hayotini yaxshilay oladigan kadrlarni tayyorlash.\n\nYo‘nalishlar orasida qurilish muhandisligi va arxitektura, kompyuter injiniringi va IT, iqtisodiyot va biznes, yurisprudensiya, davlat va jamiyat boshqaruvi, xalqaro munosabatlar, psixologiya va filologiya bor. Universitet Jiangsu pedagogika universiteti, Woosong universitetining iDegree dasturi va Britaniya Kengashi kabi xalqaro hamkorlar bilan ishlaydi."
        ),
        facts: {
          en: [
            "5,550+ students",
            "34 study programmes in 6 departments; 118 staff",
            "Programmes include Construction Engineering & Architecture and Computer Engineering & IT",
            "State licence No. 691300",
          ],
          ru: [
            "Более 5 550 студентов",
            "34 направления обучения, 6 кафедр, 118 сотрудников",
            "Среди направлений — строительная инженерия и архитектура, компьютерная инженерия и IT",
            "Государственная лицензия № 691300",
          ],
          uz: [
            "5 550 dan ortiq talaba",
            "34 ta ta’lim yo‘nalishi, 6 ta kafedra, 118 nafar xodim",
            "Yo‘nalishlar orasida qurilish muhandisligi va arxitektura, kompyuter injiniringi va IT",
            "Davlat litsenziyasi № 691300",
          ],
        },
        logo: "/partners/group/sarbon-university.png",
        website: "https://sarbon.university",
        address: i18n(
          "Sag‘bon street 290, Paxta mahalla, Olmazor district, Tashkent, Uzbekistan",
          "Узбекистан, Ташкент, Алмазарский район, махалля Пахта, ул. Сагбон, 290",
          "O‘zbekiston, Toshkent, Olmazor tumani, Paxta MFY, Sag‘bon ko‘chasi, 290-uy"
        ),
        phone: "+998 78 888 22 88",
        email: "info@sarbon.university",
        page_href: "",
      },
    },
  ],

  ...PAGE_DEFAULTS,
};
