import { useEffect, lazy, Suspense } from "react";
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
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const BlogPreview = lazy(() => import("@/components/BlogPreview"));

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
      <Suspense fallback={null}>
        <BlogPreview />
      </Suspense>
      <FinalCTA />
      <Footer />
    </>
  );
};

export default Index;
