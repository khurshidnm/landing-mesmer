// Defaults for the page-text sections of Website Content. Texts come from the
// existing translation files, so the site looks the same until an admin edits them.

import en from "../../../messages/en.json";
import ru from "../../../messages/ru.json";
import uz from "../../../messages/uz.json";

type Messages = typeof en;
type DefaultEntry = { key: string; enabled?: boolean; data: Record<string, unknown> };

/** One text in all three languages, picked from the translation files */
const tr = (pick: (m: Messages) => string) => ({ en: pick(en), ru: pick(ru as Messages), uz: pick(uz as Messages) });
const i18n = (en: string, ru: string, uz: string) => ({ en, ru, uz });
const qualityPoints = (m: Messages) => Object.values(m.about.quality.list);

export const PAGE_DEFAULTS: Record<"home_content" | "about_page" | "partners" | "seo" | "site_texts", DefaultEntry[]> = {
  home_content: [
    {
      key: "home_content",
      data: {
        partners_title: tr((m) => m.home.partners.trust_us),
        about_title: tr((m) => m.home.about.title),
        about_subtitle: tr((m) => m.home.about.subtitle),
        about_description: tr((m) => m.home.about.description),
        about_image_1: "/work1.png",
        about_image_2: "/work2.png",
        about_image_3: "/work3.png",
        mission_title: tr((m) => m.home.about.task.title),
        mission_description: tr((m) => m.home.about.task.description),
        advantages_title: tr((m) => m.home.features.title),
        advantages_subtitle: tr((m) => m.home.features.sub_title),
        advantages_description: tr((m) => m.home.features.description),
        goals_title: tr((m) => m.home.goals.title),
        goals_description: tr((m) => m.home.goals.description),
        projects_title: tr((m) => m.home.projects.title),
        projects_subtitle: tr((m) => m.home.projects.sub_title),
        projects_image: "/projects.png",
        projects_description: tr((m) => m.home.projects.description),
        projects_button: tr((m) => m.home.projects.button),
      },
    },
  ],

  about_page: [
    {
      key: "about_page",
      data: {
        hero_title: tr((m) => m.about.main_title),
        hero_image: "/about.png",
        intro_title: tr((m) => m.about.title),
        intro_image: "/about2.png",
        intro_text: tr((m) => m.about.description),
        wide_image_1: "/about3.png",
        goals_title: tr((m) => m.about.goals.title),
        goals_image: "/about4.png",
        goals_text: tr((m) => m.about.goals.description),
        competition_title: tr((m) => m.about.competition.title),
        competition_text: tr((m) => m.about.competition.description),
        wide_image_2: "/about5.png",
        ethics_title: tr((m) => m.about.ethics.title),
        ethics_text: tr((m) => m.about.ethics.description),
        quality_title: tr((m) => m.about.quality.title),
        quality_text: tr((m) => m.about.quality.description),
        quality_points: { en: qualityPoints(en), ru: qualityPoints(ru as Messages), uz: qualityPoints(uz as Messages) },
        quality_footer: tr((m) => m.about.quality.sub_description),
        partners_title: tr((m) => m.about.partners.title),
        partners_text: tr((m) => m.about.partners.description),
      },
    },
  ],

  partners: [
    { key: "home-uzsuv", data: { name: "O‘zsuvta’minot", logo: "/partners/uzsuv.svg", show_on_home: true, show_on_about: false } },
    { key: "home-adb", data: { name: "Asian Development Bank", logo: "/partners/adb.svg", show_on_home: true, show_on_about: false } },
    { key: "home-wb", data: { name: "World Bank", logo: "/partners/wb.svg", show_on_home: true, show_on_about: false } },
    { key: "home-siemens", data: { name: "Siemens", logo: "/partners/siemens.svg", show_on_home: true, show_on_about: false } },
    { key: "home-abb", data: { name: "ABB", logo: "/partners/abb.svg", show_on_home: true, show_on_about: false } },
    { key: "home-andritz", data: { name: "Andritz", logo: "/partners/andritz.svg", show_on_home: true, show_on_about: false } },
    { key: "home-danfos", data: { name: "Danfoss", logo: "/partners/danfos.svg", show_on_home: true, show_on_about: false } },
    { key: "home-faf", data: { name: "FAF", logo: "/partners/faf.svg", show_on_home: true, show_on_about: false } },
    { key: "home-grundfos", data: { name: "Grundfos", logo: "/partners/grundfos.svg", show_on_home: true, show_on_about: false } },
    { key: "home-hawle", data: { name: "Hawle", logo: "/partners/hawle.svg", show_on_home: true, show_on_about: false } },
    { key: "home-kronhe", data: { name: "Krohne", logo: "/partners/kronhe.svg", show_on_home: true, show_on_about: false } },
    { key: "home-ksb", data: { name: "KSB", logo: "/partners/ksb.svg", show_on_home: true, show_on_about: false } },
    { key: "home-kubota", data: { name: "Kubota", logo: "/partners/kubota.svg", show_on_home: true, show_on_about: false } },
    { key: "home-lutz_jesco", data: { name: "Lutz-Jesco", logo: "/partners/lutz_jesco.svg", show_on_home: true, show_on_about: false } },
    { key: "home-prominent", data: { name: "ProMinent", logo: "/partners/prominent.svg", show_on_home: true, show_on_about: false } },
    { key: "home-qarmet", data: { name: "Qarmet", logo: "/partners/qarmet.svg", show_on_home: true, show_on_about: false } },
    { key: "home-sany", data: { name: "SANY", logo: "/partners/sany.svg", show_on_home: true, show_on_about: false } },
    { key: "home-schneider_electric", data: { name: "Schneider Electric", logo: "/partners/schneider_electric.svg", show_on_home: true, show_on_about: false } },
    { key: "home-xylem", data: { name: "Xylem", logo: "/partners/xylem.svg", show_on_home: true, show_on_about: false } },
    { key: "home-sulzer", data: { name: "Sulzer", logo: "/partners/sulzer.svg", show_on_home: true, show_on_about: false } },
    { key: "home-weg", data: { name: "WEG", logo: "/partners/weg.svg", show_on_home: true, show_on_about: false } },
    { key: "home-wika", data: { name: "WIKA", logo: "/partners/wika.svg", show_on_home: true, show_on_about: false } },
    { key: "home-wilo", data: { name: "Wilo", logo: "/partners/wilo.svg", show_on_home: true, show_on_about: false } },
    { key: "home-xcmg", data: { name: "XCMG", logo: "/partners/xcmg.svg", show_on_home: true, show_on_about: false } },
    { key: "home-partner22", data: { name: "Partner 22", logo: "/partners/partner22.svg", show_on_home: true, show_on_about: false } },
    { key: "home-partner23", data: { name: "Partner 23", logo: "/partners/partner23.svg", show_on_home: true, show_on_about: false } },
    { key: "home-partner24", data: { name: "Partner 24", logo: "/partners/partner24.svg", show_on_home: true, show_on_about: false } },
    { key: "about-1", data: { name: "Partner 1", logo: "/our-partners/partner1.svg", show_on_home: false, show_on_about: true } },
    { key: "about-2", data: { name: "Partner 2", logo: "/our-partners/partner2.svg", show_on_home: false, show_on_about: true } },
    { key: "about-3", data: { name: "Partner 3", logo: "/our-partners/partner3.svg", show_on_home: false, show_on_about: true } },
    { key: "about-4", data: { name: "Partner 4", logo: "/our-partners/partner4.svg", show_on_home: false, show_on_about: true } },
    { key: "about-5", data: { name: "Partner 5", logo: "/our-partners/partner5.svg", show_on_home: false, show_on_about: true } },
    { key: "about-6", data: { name: "Partner 6", logo: "/our-partners/partner6.svg", show_on_home: false, show_on_about: true } },
    { key: "about-7", data: { name: "Partner 7", logo: "/our-partners/partner7.svg", show_on_home: false, show_on_about: true } },
    { key: "about-8", data: { name: "Partner 8", logo: "/our-partners/partner8.svg", show_on_home: false, show_on_about: true } },
    { key: "about-9", data: { name: "Partner 9", logo: "/our-partners/partner9.svg", show_on_home: false, show_on_about: true } },
    { key: "about-10", data: { name: "Partner 10", logo: "/our-partners/partner10.svg", show_on_home: false, show_on_about: true } },
    { key: "about-11", data: { name: "Partner 11", logo: "/our-partners/partner11.svg", show_on_home: false, show_on_about: true } },
    { key: "about-12", data: { name: "Partner 12", logo: "/our-partners/partner12.svg", show_on_home: false, show_on_about: true } },
    { key: "about-13", data: { name: "Partner 13", logo: "/our-partners/partner13.svg", show_on_home: false, show_on_about: true } },
    { key: "about-14", data: { name: "Partner 14", logo: "/our-partners/partner14.svg", show_on_home: false, show_on_about: true } },
    { key: "about-15", data: { name: "Partner 15", logo: "/our-partners/partner15.svg", show_on_home: false, show_on_about: true } },
    { key: "about-16", data: { name: "Partner 16", logo: "/our-partners/partner16.svg", show_on_home: false, show_on_about: true } },
    { key: "about-17", data: { name: "Partner 17", logo: "/our-partners/partner17.svg", show_on_home: false, show_on_about: true } },
    { key: "about-18", data: { name: "Partner 18", logo: "/our-partners/partner18.svg", show_on_home: false, show_on_about: true } },
    { key: "about-19", data: { name: "Partner 19", logo: "/our-partners/partner19.svg", show_on_home: false, show_on_about: true } },
    { key: "about-20", data: { name: "Partner 20", logo: "/our-partners/partner20.svg", show_on_home: false, show_on_about: true } },
    { key: "about-21", data: { name: "Partner 21", logo: "/our-partners/partner21.svg", show_on_home: false, show_on_about: true } },
    { key: "about-22", data: { name: "Partner 22", logo: "/our-partners/partner22.svg", show_on_home: false, show_on_about: true } },
    { key: "about-23", data: { name: "Partner 23", logo: "/our-partners/partner23.svg", show_on_home: false, show_on_about: true } },
    { key: "about-24", data: { name: "Partner 24", logo: "/our-partners/partner24.svg", show_on_home: false, show_on_about: true } }
  ],

  // Current page titles and descriptions (copied from each page)
  seo: [
    { key: "seo-home", data: { page: "home", title: {"en": "MESMER - Water Treatment & Wastewater Infrastructure EPC Contractor Uzbekistan", "ru": "MESMER — EPC-подрядчик по строительству ВОС и КОС в Узбекистане", "uz": "MESMER — O‘zbekistonda suv va oqova suv tozalash inshootlari EPC pudratchisi"}, description: {"en": "MESMER is a premier water treatment company and wastewater treatment EPC contractor in Uzbekistan & Central Asia. Turnkey WWTP & WTP construction, ADB and EBRD water infrastructure projects.", "ru": "MESMER — ведущий EPC-подрядчик по строительству водоочистных станций (ВОС) и очистных сооружений канализации (КОС) в Узбекистане и Центральной Азии. Проекты АБР и ЕБРР.", "uz": "MESMER — O‘zbekiston va Markaziy Osiyoda suv tozalash (WTP) va oqova suv tozalash (WWTP) inshootlari bo‘yicha yetakchi EPC pudratchi. OTB va EBRD loyihalari."} } },
    { key: "seo-about", data: { page: "about", title: {"en": "About MESMER | Water Treatment & Wastewater EPC Contractor Uzbekistan", "ru": "О компании MESMER | Строительство КОС и ВОС в Узбекистане", "uz": "MESMER haqida | O'zbekistonda suv va oqova suv tozalash inshootlari qurilishi"}, description: {"en": "Learn about MESMER — leading EPC contractor in Uzbekistan specializing in turnkey water treatment plants (WTP), wastewater treatment plants (WWTP), and municipal water infrastructure.", "ru": "MESMER — генеральный подрядчик в Узбекистане по строительству и модернизации очистных сооружений канализации (КОС), водоочистных станций (ВОС) и насосных станций.", "uz": "MESMER — O'zbekistonda suv tozalash, oqova suv tozalash (WWTP/WTP) va nasos stansiyalari qurilishi bo'yicha yetakchi EPC bosh pudratchi kompaniya."} } },
    { key: "seo-projects", data: { page: "projects", title: {"en": "Water & Wastewater Treatment EPC Projects Uzbekistan | WWTP & WTP Contractor | MESMER", "ru": "Проекты строительства ВОС и КОС в Узбекистане | Подрядчик водной инфраструктуры | MESMER", "uz": "O'zbekistonda suv va oqova suv tozalash EPC loyihalari | WWTP va WTP inshootlari | MESMER"}, description: {"en": "Explore MESMER's portfolio of WWTP and WTP construction projects across Uzbekistan and Central Asia, including major ADB and EBRD financed water infrastructure contracts.", "ru": "Портфолио проектов MESMER: строительство и реконструкция очистных сооружений (КОС/ВОС), насосных станций и водопроводных сетей в Узбекистане при поддержке ЕБРР и АБР.", "uz": "MESMER kompaniyasining suv tozalash (WTP) va oqova suv tozalash (WWTP) loyihalari portfeli. OTB, EBRD va Jahon banki xalqaro infratuzilma shartnomalari."} } },
    { key: "seo-expertise", data: { page: "expertise", title: {"en": "Water & Wastewater Engineering Expertise | EPC Contractor Uzbekistan | MESMER", "ru": "Экспертиза в водоснабжении и водоотведении | EPC-подрядчик | MESMER", "uz": "Suv va oqova suv muhandisligi | EPC pudratchi | MESMER"}, description: {"en": "Water treatment, wastewater treatment, water supply networks, irrigation and full EPC delivery — MESMER’s core expertise across Uzbekistan and Central Asia.", "ru": "Водоподготовка, очистка сточных вод, сети водоснабжения, ирригация и EPC «под ключ» — ключевая экспертиза MESMER в Узбекистане и Центральной Азии.", "uz": "Suv tozalash, oqova suv tozalash, suv ta’minoti tarmoqlari, irrigatsiya va to‘liq EPC — MESMERning O‘zbekiston va Markaziy Osiyodagi asosiy yo‘nalishlari."} } },
    { key: "seo-group", data: { page: "group", title: {"en": "MESMER Group | MESMER", "ru": "Группа MESMER | MESMER", "uz": "MESMER Group | MESMER"}, description: {"en": "MESMER Group brings together EPC construction, water treatment equipment manufacturing, HDPE pipe and precast production, and engineering education.", "ru": "Группа MESMER объединяет EPC-строительство, производство оборудования для водоочистки, выпуск ПНД-труб и ЖБИ, а также инженерное образование.", "uz": "MESMER Group EPC qurilish, suv tozalash uskunalari ishlab chiqarish, HDPE quvurlar va temir-beton buyumlar ishlab chiqarish hamda muhandislik ta’limini birlashtiradi."} } },
    { key: "seo-news", data: { page: "news", title: {"en": "Company News & Water Infrastructure Updates | MESMER", "ru": "Новости компании и водная инфраструктура Узбекистана | MESMER", "uz": "Kompaniya yangiliklari va suv inshootlari qurilishi | MESMER"}, description: {"en": "Latest corporate news, construction milestones, and project launches for WWTP, WTP, and water infrastructure across Uzbekistan by MESMER.", "ru": "Актуальные новости, этапы строительства и запуск объектов КОС и ВОС в Узбекистане компанией MESMER.", "uz": "MESMER kompaniyasining so'nggi yangiliklari, suv va oqova suv tozalash inshootlari qurilishi borasidagi hisobotlar."} } },
    { key: "seo-career", data: { page: "career", title: {"en": "Careers & Engineering Jobs | Water Infrastructure EPC | MESMER", "ru": "Карьера и вакансии в строительстве водной инфраструктуры | MESMER", "uz": "Karyera va bo'sh ish o'rinlari | Suv inshootlari qurilishi | MESMER"}, description: {"en": "Join MESMER engineering team. Discover career opportunities in municipal WWTP, WTP construction, and water infrastructure EPC projects across Uzbekistan.", "ru": "Работа в MESMER: открытые вакансии инженеров, проектировщиков и специалистов по строительству КОС и ВОС в Узбекистане.", "uz": "MESMER jamoasiga qo'shiling: suv tozalash va oqova suv inshootlari qurilishi bo'yicha bo'sh ish o'rinlari."} } },
    { key: "seo-contact", data: { page: "contact", title: {"en": "Contact MESMER | Water Infrastructure & Wastewater EPC Contractor", "ru": "Контакты MESMER | Строительство КОС, ВОС и водной инфраструктуры", "uz": "Bog'lanish | MESMER suv va oqova suv inshootlari bosh pudratchisi"}, description: {"en": "Contact MESMER for turnkey engineering, WTP construction, WWTP EPC, and municipal water infrastructure projects in Uzbekistan and Central Asia.", "ru": "Свяжитесь с MESMER для реализации проектов строительства и реконструкции очистных сооружений канализации и водоснабжения.", "uz": "Suv tozalash, oqova suv tozalash inshootlari va suv ta'minoti loyihalari bo'yicha MESMER bilan bog'laning."} } },
    { key: "seo-start-a-project", data: { page: "start-a-project", title: {"en": "Start a Project with MESMER | Water & Wastewater EPC Contractor", "ru": "Начать проект с MESMER | EPC-подрядчик ВОС и КОС", "uz": "MESMER bilan loyiha boshlash | Suv va oqova suv EPC pudratchisi"}, description: {"en": "Send your project scope or tender documents to MESMER. Our engineering and EPC team reviews WTP, WWTP and water supply inquiries and responds quickly.", "ru": "Отправьте параметры объекта или тендерную документацию. Инженеры MESMER рассмотрят запрос по ВОС, КОС и водоснабжению и оперативно ответят.", "uz": "Loyiha parametrlari yoki tender hujjatlarini yuboring. MESMER muhandislari WTP, WWTP va suv ta’minoti bo‘yicha murojaatingizni ko‘rib chiqib, tezda javob beradi."} } }
  ],

  site_texts: [
    {
      key: "site_texts",
      data: {
        footer_tagline: tr((m) => m.footer.tagline),
        contact_title: tr((m) => m.contact.title),
        contact_eyebrow: tr((m) => m.contact.contacts),
        contact_company: i18n("MESMER-EAST LLC", "ООО «MESMER-EAST»", "MESMER-EAST MChJ"),
        contact_intro: i18n(
          "Full-cycle EPC general contractor specializing in turnkey water treatment plants (WTP), wastewater treatment plants (WWTP), and municipal water infrastructure across Uzbekistan and Central Asia.",
          "Генеральный подрядчик полного цикла (EPC) по проектированию, строительству и модернизации водоочистных станций (ВОС), очистных сооружений канализации (КОС) и насосных станций в Узбекистане.",
          "O'zbekistonda suv tozalash inshootlari (WTP), oqova suv tozalash inshootlari (WWTP) va nasos stansiyalarini loyihalash hamda qurish bo'yicha to'liq sikldagi bosh pudratchi (EPC)."
        ),
        contact_standards_title: i18n("FIDIC & EPC Standards", "FIDIC & EPC Standards", "FIDIC & EPC Standards"),
        contact_standards_text: i18n(
          "ISO 9001:2015 • ISO 14001:2015 • ISO 45001:2018",
          "ISO 9001:2015 • ISO 14001:2015 • ISO 45001:2018",
          "ISO 9001:2015 • ISO 14001:2015 • ISO 45001:2018"
        ),
        form_eyebrow: i18n("Project Inquiry & Cooperation", "Заявка на проект и сотрудничество", "Loyiha va hamkorlik murojaati"),
        form_title: tr((m) => m.contact.form.title),
        form_subtitle: tr((m) => m.contact.form.subtitle),
        form_success_title: tr((m) => m.contact.form.success_title),
        form_success_text: tr((m) => m.contact.form.success_desc),
      },
    },
  ],
};
