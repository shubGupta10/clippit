import { FloatingHeader } from "@/components/floating-header";
import { HeroSection } from "@/components/hero-section-dark";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { MidPageCTA } from "@/components/landing/MidPageCTA";
import { WhyYouNeed } from "@/components/landing/WhyYouNeed";
import { Collections } from "@/components/landing/Collections";
import { Pricing } from "@/components/landing/Pricing";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="dark">
      <main className="min-h-screen bg-background text-foreground">
        <FloatingHeader />
        <HeroSection 
          gridOptions={{ opacity: 0.32 }} 
        />
        
        <div className="py-16 md:py-24">
          <HowItWorks />
        </div>
        
        <div className="py-16 md:py-24">
          <Features />
        </div>

        <MidPageCTA />
        
        <div className="py-16 md:py-24">
          <WhyYouNeed />
        </div>
        
        <div className="py-20 md:py-28">
          <Collections />
        </div>

        <div className="py-20 md:py-28">
          <Pricing />
        </div>
        
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}
