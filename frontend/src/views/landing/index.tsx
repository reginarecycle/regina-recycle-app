import Hero from "@/components/landing-ui/Hero";
import AboutSection from "@/components/landing-ui/AboutUs";
import BenefitsSection from "@/components/landing-ui/BenefitsSection";
import KnowledgeHubSection from "@/components/landing-ui/KnowledgeHub";
import FAQSection from "@/components/landing-ui/FAQ";
import CTASection from "@/components/landing-ui/CTASection";
import Footer from "@/components/landing-ui/Footer";

function LandingPage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <BenefitsSection />
      <KnowledgeHubSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}

export default LandingPage;
