import mongoose from "mongoose";

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mesmer-admin";
  console.log("Connecting to MongoDB at:", MONGODB_URI);

  await mongoose.connect(MONGODB_URI, {
    dbName: "mesmer-admin",
  });

  const db = mongoose.connection.db;
  const projectsCollection = db.collection("projects");
  const constsCollection = db.collection("constants");

  const seoData = [
    {
      slug: "shahrisabz-shahridagi-quvvati-39-000-msutka-bolgan-oqova-suv-tozalash-inshootini-rekonstruksiya-qilish-epc",
      en: {
        meta_title: "WWTP EPC Central Asia | Shakhrisabz Wastewater Treatment Plant (39,000 m³/day) | MESMER",
        meta_description: "Full-cycle WWTP EPC contractor in Central Asia. Turnkey construction & reconstruction of Shakhrisabz wastewater treatment plant (39,000 m³/day) under international FIDIC/EPC standards."
      },
      ru: {
        meta_title: "EPC-строительство КОС в Центральной Азии | Очистные сооружения Шахрисабз (39 000 м³/сут) | MESMER",
        meta_description: "Строительство и реконструкция очистных сооружений сточных вод (КОС) в Шахрисабзе мощностью 39 000 м³/сутки. EPC-подрядчик в Узбекистане и Центральной Азии."
      },
      uz: {
        meta_title: "Markaziy Osiyoda oqova suv tozalash inshootlari EPC | Shahrisabz WWTP (39 000 m³/kun) | MESMER",
        meta_description: "Shahrisabz shahrida quvvati 39 000 m³/kun bo'lgan oqova suv tozalash inshootini (WWTP) to'liq EPC asosida rekonstruksiya qilish loyihasi."
      }
    },
    {
      slug: "pitnak-shahridagi-suv-tozalash-inshootini-rekonstruksiya-qilish-200-000-m3sutkadan-400-000-m3sutka-ga-quvvati-oshiriladi-epc",
      en: {
        meta_title: "WTP Construction Uzbekistan | Pitnak Water Treatment Plant (400,000 m³/day) | EBRD Project",
        meta_description: "Leading water treatment company in Uzbekistan delivering rehabilitation & extension of Pitnak WTP to 400,000 m³/day under European Bank for Reconstruction and Development (EBRD)."
      },
      ru: {
        meta_title: "Строительство ВОС в Узбекистане | Водоочистное сооружение Питнак (400 000 м³/сут) | ЕБРР | MESMER",
        meta_description: "Реконструкция и расширение ВОС в Питнаке с увеличением мощности до 400 000 м³/сутки при финансировании ЕБРР. EPC-подрядчик водоочистных сооружений в Узбекистане."
      },
      uz: {
        meta_title: "O'zbekistonda suv tozalash inshootlari qurilishi | Pitnak WTP (400 000 m³/kun) | EBRD loyihasi | MESMER",
        meta_description: "Pitnak shahridagi suv tozalash inshootini (WTP) 400 000 m³/kun quvvatga oshirish va rekonstruksiya qilish EPC loyihasi. EBRD moliyalashtirgan."
      }
    },
    {
      slug: "qarshi-shahridagi-quvvati-60-000-msutka-bolgan-oqova-suv-tozalash-inshootini-rekonstruksiya-qilish-epc",
      en: {
        meta_title: "Wastewater Treatment EPC Contractor | Karshi WWTP (60,000 m³/day) | EBRD Water Projects Uzbekistan",
        meta_description: "MESMER is the wastewater treatment EPC contractor executing reconstruction of Karshi WWTP (60,000 m³/day) in Uzbekistan, financed by European Bank for Reconstruction and Development (EBRD)."
      },
      ru: {
        meta_title: "EPC-подрядчик очистных сооружений (КОС) | Карши (60 000 м³/сут) | Проекты ЕБРР в Узбекистане | MESMER",
        meta_description: "Реконструкция очистных сооружений канализации Карши мощностью 60 000 м³/сутки (EPC) в рамках проектов ЕБРР в Узбекистане. Ведущий подрядчик водной инфраструктуры."
      },
      uz: {
        meta_title: "Oqova suv tozalash EPC pudratchisi | Qarshi WWTP (60 000 m³/kun) | EBRD suv loyihalari O'zbekiston | MESMER",
        meta_description: "Qarshi shahrida quvvati 60 000 m³/kun bo'lgan oqova suv tozalash inshootini (WWTP) rekonstruksiya qilish EPC shartnomasi (EBRD)."
      }
    },
    {
      slug: "samarqand-viloyati-kattaqorgon-shahridagi-quvvati-20-000-msutka-bolgan-boynazar-oqova-suv-tozalash-inshootini-rekonstruksiya-qilish-epc",
      en: {
        meta_title: "WWTP Contractor Central Asia | Boynazar WWTP (20,000 m³/day) | EBRD Water Projects Uzbekistan",
        meta_description: "EPC construction of Boynazar WWTP in Kattakurgan (20,000 m³/day) under EBRD water projects in Uzbekistan. Proven WWTP contractor and wastewater treatment plant EPC leader in Central Asia."
      },
      ru: {
        meta_title: "Подрядчик КОС в Центральной Азии | Очистные сооружения Бойназар Каттакурган (20 000 м³/сут) | ЕБРР",
        meta_description: "Строительство очистных сооружений Бойназар в Каттакургане (20 000 м³/сут) под ключ по проекту ЕБРР. EPC-подрядчик водной инфраструктуры в Центральной Азии."
      },
      uz: {
        meta_title: "Markaziy Osiyoda WWTP pudratchisi | Boynazar oqova suv tozalash inshooti (20 000 m³/kun) | EBRD loyihasi",
        meta_description: "Kattaqo'rg'on shahrida quvvati 20 000 m³/kun bo'lgan Boynazar oqova suv tozalash inshootini (EPC) qurish loyihasi (EBRD)."
      }
    },
    {
      slug: "ps2-va-bps-nasos-stansiyalari-hamda-ularga-tegishli-bosimli-quvurlar-epc",
      en: {
        meta_title: "ADB Water Projects Central Asia | Wastewater Pumping Stations PS2 & B-PS EPC",
        meta_description: "EPC construction of wastewater pumping stations PS2 & B-PS with force mains in Central Asia, financed by Asian Development Bank (ADB). Turnkey water infrastructure contractor."
      },
      ru: {
        meta_title: "Проекты АБР в Центральной Азии | Канализационные насосные станции НС-2 и Б-НС (EPC) | MESMER",
        meta_description: "Строительство канализационных насосных станций НС-2 и Б-НС с напорными коллекторами при финансировании Азиатского банка развития (АБР). EPC-подрядчик."
      },
      uz: {
        meta_title: "Markaziy Osiyoda OTB suv loyihalari | NS-2 va B-NS nasos stansiyalari EPC | MESMER",
        meta_description: "Osiyo Taraqqiyot Banki (OTB) tomonidan moliyalashtirilgan NS-2 va B-NS oqova suv nasos stansiyalari hamda bosimli quvurlarni qurish EPC loyihasi."
      }
    },
    {
      slug: "beruniy-tumani-suv-taminoti-tizimini-rivojlantirish",
      en: {
        meta_title: "ADB Water Projects Uzbekistan | Water Infrastructure Contractor | Beruniy Water Supply",
        meta_description: "Modernization of water supply systems in Beruniy district under Asian Development Bank (ADB) financing. Premier water infrastructure contractor and water treatment company in Uzbekistan."
      },
      ru: {
        meta_title: "Водные проекты АБР в Узбекистане | Развитие системы водоснабжения Берунийского района | MESMER",
        meta_description: "Проект развития систем водоснабжения в Берунийском районе при поддержке Азиатского банка развития (АБР). Генеральный подрядчик водной инфраструктуры Узбекистана."
      },
      uz: {
        meta_title: "O'zbekistonda OTB suv loyihalari | Beruniy tumani suv ta'minoti tizimini rivojlantirish | MESMER",
        meta_description: "Osiyo Taraqqiyot Banki (OTB) ishtirokida Beruniy tumani ichimlik suvi ta'minoti tizimini keng ko'lamli modernizatsiya qilish loyihasi."
      }
    },
    {
      slug: "buxoro-shahridagi-shohrud-suv-tozalash-inshootlarini-rekonstruksiya-qilish",
      en: {
        meta_title: "Water Treatment Company Uzbekistan | Shohrud Bukhara WTP Reconstruction",
        meta_description: "Reconstruction of Shohrud water treatment facilities in Bukhara under World Bank and IDA funding. Comprehensive WTP construction and engineering by MESMER in Uzbekistan."
      },
      ru: {
        meta_title: "Водоочистная компания Узбекистана | Реконструкция водоочистных сооружений «Шохруд» в Бухаре | MESMER",
        meta_description: "Реконструкция водоочистных сооружений «Шохруд» в Бухаре в рамках проектов Всемирного банка. EPC-инжиниринг и строительство ВОС в Узбекистане."
      },
      uz: {
        meta_title: "O'zbekistonda suv tozalash kompaniyasi | Buxorodagi «Shohrud» suv tozalash inshootlarini rekonstruksiya qilish",
        meta_description: "Buxoro shahridagi «Shohrud» suv tozalash inshootlarini Jahon banki va Xalqaro taraqqiyot assotsiatsiyasi mablag'lari hisobidan rekonstruksiya qilish."
      }
    },
    {
      slug: "m2-suv-taminoti-kanalini-qurish",
      en: {
        meta_title: "Water Infrastructure Contractor Uzbekistan | M2 Water Supply Canal Construction",
        meta_description: "Construction of the strategic M2 water supply canal in Uzbekistan. Turnkey hydraulic and water infrastructure engineering by MESMER under World Bank / IDA financing."
      },
      ru: {
        meta_title: "Подрядчик водной инфраструктуры Узбекистана | Строительство водопроводного канала М2 | MESMER",
        meta_description: "Строительство магистрального водопроводного канала М2 в Узбекистане. Гидротехнические и строительные решения от компании MESMER."
      },
      uz: {
        meta_title: "O'zbekistonda suv infratuzilmasi pudratchisi | M2 suv ta'minoti kanalini qurish | MESMER",
        meta_description: "O'zbekistonda M2 magistral suv ta'minoti kanalini qurish bo'yicha yirik gidrotexnika loyihasi (Jahon banki)."
      }
    },
    {
      slug: "dostlikda-3nasos-stansiyasi-va-yordamchi-inshootlarni-qurish",
      en: {
        meta_title: "Water Infrastructure Contractor Uzbekistan | Dustlik Pumping Station No. 3 EPC",
        meta_description: "Turnkey construction of Dustlik pumping station No. 3 and auxiliary hydraulic infrastructure in Uzbekistan under World Bank / IDA funding. Reliable water contractor."
      },
      ru: {
        meta_title: "Строительство насосной станции №3 в Дустлике | Водная инфраструктура Узбекистана | MESMER",
        meta_description: "Строительство насосной станции №3 и вспомогательных гидротехнических сооружений в Дустлике (проекты Всемирного банка)."
      },
      uz: {
        meta_title: "Do'stlikda 3-nasos stansiyasini qurish | O'zbekiston suv infratuzilmasi | MESMER",
        meta_description: "Do'stlik tumanida 3-nasos stansiyasi va yordamchi inshootlarni to'liq qurish va montaj qilish loyihasi."
      }
    },
    {
      slug: "sardoba-tumanidagi-kanalni-rekonstruksiya-qilish",
      en: {
        meta_title: "Water Infrastructure Contractor Uzbekistan | Sardoba Canal Reconstruction",
        meta_description: "Comprehensive reconstruction and reinforcement of critical irrigation and water transmission canals in Sardoba, Uzbekistan by MESMER."
      },
      ru: {
        meta_title: "Реконструкция канала в Сардобинском районе | Водная инфраструктура Узбекистана | MESMER",
        meta_description: "Комплексная реконструкция водохозяйственного и оросительного канала в Сардобинском районе компанией MESMER."
      },
      uz: {
        meta_title: "Sardoba tumanidagi kanalni rekonstruksiya qilish | Suv infratuzilmasi | MESMER",
        meta_description: "Sardoba tumanidagi suv ta'minoti va sug'orish kanalini qayta tiklash va rekonstruksiya qilish loyihasi."
      }
    }
  ];

  console.log("Updating projects SEO meta data...");
  for (const item of seoData) {
    const res = await projectsCollection.updateOne(
      { slug: item.slug },
      {
        $set: {
          "en.meta_title": item.en.meta_title,
          "en.meta_description": item.en.meta_description,
          "ru.meta_title": item.ru.meta_title,
          "ru.meta_description": item.ru.meta_description,
          "uz.meta_title": item.uz.meta_title,
          "uz.meta_description": item.uz.meta_description,
        }
      }
    );
    console.log(`Updated [${item.slug}]: matched ${res.matchedCount}, modified ${res.modifiedCount}`);
  }

  console.log("\nUpdating Constants services_seo...");
  const constsRes = await constsCollection.updateOne(
    {},
    {
      $set: {
        services_seo: {
          en: {
            title: "Water Treatment Company Uzbekistan | Wastewater Treatment EPC Contractor | MESMER",
            description: "MESMER is a premier water treatment company and wastewater treatment plant EPC contractor in Uzbekistan & Central Asia. Expert in WWTP EPC, WTP construction, ADB and EBRD water projects."
          },
          ru: {
            title: "EPC-подрядчик водоочистных сооружений и ВОС/КОС в Узбекистане | MESMER",
            description: "MESMER — ведущий EPC-подрядчик по строительству водоочистных станций (ВОС) и очистных сооружений канализации (КОС) в Узбекистане и Центральной Азии. Проекты ЕБРР и АБР."
          },
          uz: {
            title: "O'zbekistonda suv tozalash va oqova suv tozalash inshootlari EPC pudratchisi | MESMER",
            description: "MESMER — O'zbekiston va Markaziy Osiyoda suv tozalash (WTP) va oqova suv tozalash inshootlari (WWTP) bo'yicha yetakchi EPC bosh pudratchisi. OTB va EBRD loyihalari."
          }
        }
      }
    },
    { upsert: true }
  );
  console.log("Updated Constants services_seo:", constsRes);

  await mongoose.disconnect();
  console.log("Done!");
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
