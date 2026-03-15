import { HeroSection } from "@/components/hero-section-dark";
import { FloatingHeader } from "@/components/floating-header";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <FloatingHeader />
      <HeroSection
        title="Now in Beta"
        subtitle={{
          regular: "Save, organize, and search",
          gradient: "everything you find online.",
        }}
        description="Clippit turns your browsing into a searchable library. Save text, images, and pages with one click. Find them later by describing what you want."
        ctaText="Get started"
        ctaHref="/sign-up"
        bottomImage={{
          light: "https://farmui.vercel.app/dashboard-light.png",
          dark: "https://farmui.vercel.app/dashboard.png"
        }}
      />
      <HowItWorks />
      <Features />
      <CTASection />
      <Footer />
    </main>
  );
}
