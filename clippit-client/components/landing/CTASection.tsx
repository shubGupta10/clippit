import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const RetroGrid = ({
  angle = 35,
  cellSize = 60,
  opacity = 0.1,
  lightLineColor = "rgba(var(--primary), 0.1)",
  darkLineColor = "rgba(var(--primary), 0.1)",
}) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden perspective-[200px]",
        "opacity-(--opacity)",
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 transform-[rotateX(var(--grid-angle))]">
        <div className="animate-grid bg-[linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] bg-repeat bg-size-[var(--cell-size)_var(--cell-size)] h-[300vh] inset-[0%_0px] ml-[-200%] origin-[100%_0_0] w-[600vw] dark:bg-[linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-background to-transparent to-90%" />
    </div>
  );
};

export function CTASection() {
  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="group relative rounded-[2rem] md:rounded-[3rem] border border-border/60 bg-card p-10 md:p-20 text-center overflow-hidden shadow-2xl transition-all duration-700 hover:border-primary/20">
          
          {/* Visual Floor & Background */}
          <RetroGrid opacity={0.08} angle={45} />
          
          {/* Bloom Effect */}
          <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Header / Sub-label */}
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-8 opacity-90">
              Ready to start?
            </p>

            {/* Title with fluid typography and luxury tracking */}
            <h2 className="mx-auto font-serif text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.05] tracking-[-0.05em] text-foreground text-balance">
              Everything you find deserves a place to live.
            </h2>

            {/* Sub-text with high industry contrast */}
            <p className="mx-auto mt-8 max-w-xl text-base md:text-xl leading-relaxed text-muted-foreground/80 opacity-90">
              You come across good things every day, from sharp headlines to product pages and images. Clippit saves it all and brings it back when you need it.
            </p>

            {/* Main Conversion Group */}
            <div className="mt-12 flex flex-col items-center justify-center relative">
              <Link
                href="/sign-up"
                className="group/btn relative rounded-full bg-foreground px-12 py-5 text-lg font-bold text-background transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-primary/20"
              >
                Get started for free
              </Link>
            </div>

            <p className="mt-10 text-xs font-medium text-muted-foreground/60 tracking-tight italic">
              No credit card required • Instant setup • 100% Secure
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
