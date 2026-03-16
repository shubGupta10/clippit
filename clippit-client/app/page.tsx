import { FloatingHeader } from "@/components/floating-header";
import { HeroSection } from "@/components/hero-section-dark";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { WhyYouNeed } from "@/components/landing/WhyYouNeed";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="dark">
      <main className="min-h-screen bg-background text-foreground">
        <FloatingHeader />
        <HeroSection gridOptions={{ opacity: 0.32 }} />
        <HowItWorks />
        <Features />
        <WhyYouNeed />
        <CTASection />
      </main>
    </div>
  );
}
