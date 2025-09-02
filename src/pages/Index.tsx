import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ValueProposition from "@/components/ValueProposition";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Methodology from "@/components/Methodology";
import Team from "@/components/Team";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
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
      <FinalCTA />
      <Footer />
    </>
  );
};

export default Index;