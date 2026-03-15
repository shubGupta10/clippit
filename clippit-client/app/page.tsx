import { HeroSection } from "@/components/hero-section-dark";
import { FloatingHeader } from "@/components/floating-header";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <FloatingHeader />
      <HeroSection
        title="Welcome to Clippit"
        subtitle={{
          regular: "Save, organize, and search ",
          gradient: "everything you find online.",
        }}
        description="Your ultimate intelligent bookmarking tool. Save links, text snippets, and images with a single click. Find them instantly with semantic AI vector search."
        ctaText="Get Started"
        ctaHref="/sign-in"
      />
    </main>
  );
}
