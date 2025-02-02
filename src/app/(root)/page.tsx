import React from "react";
import Hero from "./components/Hero";
import About from "./components/About";
import Testimonials from "./components/Testimonals";
import Advantages from "./components/Features";
import PartnersCarousel from "./components/Partners";
import Banner from "./components/Banner";
import Image from "next/image";
import BusinessActivities from "./components/Carousel";
import Footer from "./components/Footer";
import Goals from "./components/Goals";
import HomeProjects from "./components/HomeProjects";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <PartnersCarousel />
      <About />
      <Advantages />
      <Banner />
      <BusinessActivities />
      <Goals />
      <HomeProjects />
      <Footer />
    </div>
  );
};

export default HomePage;
