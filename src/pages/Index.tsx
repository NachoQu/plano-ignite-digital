import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ValueProposition from "@/components/ValueProposition";
import CaseStudies from "@/components/CaseStudies";
import Methodology from "@/components/Methodology";
import About from "@/components/About";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <ValueProposition />
      <CaseStudies />
      <Methodology />
      <About />
      <FinalCTA />
      <Footer />
    </>
  );
};

export default Index;