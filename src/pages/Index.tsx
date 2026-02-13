import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ValueProposition from "@/components/ValueProposition";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Methodology from "@/components/Methodology";
import Team from "@/components/Team";
import WorkTogether from "@/components/WorkTogether";
import BlogPreview from "@/components/BlogPreview";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(state.scrollTo!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <ValueProposition />
      <Projects />
      <Testimonials />
      <Methodology />
      <Team />
      <WorkTogether />
      <BlogPreview />
      <FinalCTA />
      <Footer />
    </>
  );
};

export default Index;
