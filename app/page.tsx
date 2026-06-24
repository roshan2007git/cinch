import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import ProcessSection from "@/components/sections/process-section";
import PricingSection from "@/components/sections/pricing-section";
import FAQSection from "@/components/sections/faq-section";
import ContactSection from "@/components/sections/contact-section";
import Footer from "@/components/layout/footer";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ProcessSection />
      <PricingSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}