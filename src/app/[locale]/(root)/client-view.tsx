"use client"
import React, { FC } from "react";
import Hero from "./components/Hero";
import About from "./components/About";
import Advantages from "./components/Features";
import PartnersCarousel from "./components/Partners";
import Banner from "./components/Banner";
import BusinessActivities from "./components/Carousel";
import Footer from "./components/Footer";
import Goals from "./components/Goals";
import HomeProjects from "./components/HomeProjects";
import { Certificate } from "@/types/certificates";
import { useTranslations } from "next-intl";

interface Props {
  certificates: Certificate[]
}

const HomePage: FC<Props> = ({certificates}) => {
  const t = useTranslations("home.hero");
  return (
    <div>
      <Hero
        backgroundImage={"/heroImg.png"}
        height={"100vh"}
        subtitle={t("subtitle")}
        title={t("title")}
      />
      <PartnersCarousel />
      <About />
      <Advantages certificates={certificates} />
      <Banner />
      <BusinessActivities />
      <Goals />
      <HomeProjects />
      <Footer />
    </div>
  );
};

export default HomePage;
