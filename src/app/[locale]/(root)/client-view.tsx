"use client"
import React, { FC } from "react";
import HomeHero from "./components/HomeHero";
import About from "./components/About";
import Advantages from "./components/Features";
import PartnersCarousel from "./components/Partners";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Goals from "./components/Goals";
import HomeProjects from "./components/HomeProjects";
import CompanyNumbers from "./components/CompanyNumbers";
import CoreExpertise from "./components/CoreExpertise";
import FinanciersBlock from "./components/FinanciersBlock";
import { Certificate } from "@/types/certificates";
import type { ProjectCardData } from "@/components/project-card";
import type { ExpertiseEntry, FinancierEntry, HeroContent, HomeContent, PartnerEntry, StatEntry } from "@/lib/cms/content-types";

interface Props {
  certificates: Certificate[];
  hero: HeroContent;
  stats: StatEntry[];
  expertise: ExpertiseEntry[];
  financiers: FinancierEntry[];
  content: HomeContent;
  partners: PartnerEntry[];
  projects: ProjectCardData[];
}

const HomePage: FC<Props> = ({ certificates, hero, stats, expertise, financiers, content, partners, projects }) => {
  return (
    <div>
      <HomeHero hero={hero} stats={stats} />
      <PartnersCarousel content={content} partners={partners} />
      <About content={content} />
      <CompanyNumbers stats={stats} />
      <CoreExpertise items={expertise} />
      <FinanciersBlock financiers={financiers} />
      <Advantages certificates={certificates} content={content} />
      <Banner />
      <Goals content={content} />
      <HomeProjects content={content} projects={projects} financiers={financiers} />
      <Footer />
    </div>
  );
};

export default HomePage;
