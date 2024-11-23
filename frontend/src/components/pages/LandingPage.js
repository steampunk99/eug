import React, { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../context/DarkMode";
import { useLocation } from "react-router-dom";
import ArtisticLoader from "../../lib/loader";
import Header from "../sections/Header";
import Hero from "../sections/Hero";
import Footer from "../sections/Footer";
import About from "../sections/About";
import Contact from "../sections/Contact";
import GlassmorphicFAQSection from "../sections/Faq";
import Parallax from "../sections/Parallax";

const LandingPage = () => {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
  
    useEffect(() => {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Simulate a delay for the loading
  
      return () => clearTimeout(timer);
    }, [location]);
  
    return (
      <div className="bg-background h-[100vh]">
        {isLoading ? (
          <ArtisticLoader />
        ) : (
          <div className="/">
            <Header className="mb-12" />
  
            <section id="home">
              <Hero />
            </section>
            
     
            <section id="about">
              <About />
            </section>
           
            <section id="contact">
              <Contact />
            </section>
            <section id="faq">
              <GlassmorphicFAQSection />
            </section>
          <section id="parallax">
            <Parallax />
          </section>
            <Footer />
          </div>
        )}
      </div>
    );
  };

  export default LandingPage;