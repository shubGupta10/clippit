"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: {
    regular: string;
    gradient: string;
  };
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  bottomImage?: {
    light: string;
    dark: string;
  };
  gridOptions?: {
    angle?: number;
    cellSize?: number;
    opacity?: number;
    lightLineColor?: string;
    darkLineColor?: string;
  };
}

const RetroGrid = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.32,
  lightLineColor = "var(--border)",
  darkLineColor = "var(--border)",
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

const HeroImage = ({ light, dark }: { light: string; dark: string }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [transform, setTransform] = React.useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsHovered(true);
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 40;
    const y = -(e.clientY - top - height / 2) / 40;
    setTransform(`perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  };

  return (
    <div className="mt-8 sm:mt-14 w-full max-w-5xl px-2 md:px-6 relative z-20">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative w-full rounded-2xl md:rounded-[2rem] border border-border/50 bg-card p-2 md:p-4 shadow-2xl transition-all ease-out",
          isHovered ? "duration-100" : "duration-500"
        )}
        style={{ transform, transformStyle: "preserve-3d" }}
      >
        <div 
          className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 transition-opacity duration-500" 
          style={{ opacity: isHovered ? 0.5 : 0 }} 
        />
        <div className="w-full overflow-hidden rounded-xl md:rounded-[1.5rem] border border-border/50 bg-background shadow-inner relative">
          <div className="absolute top-0 inset-x-0 h-10 bg-muted/30 border-b border-border/50 flex items-center px-4 gap-2 backdrop-blur-md z-10">
            <div className="flex gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-border" />
               <div className="w-2.5 h-2.5 rounded-full bg-border" />
               <div className="w-2.5 h-2.5 rounded-full bg-border" />
            </div>
          </div>
          <img src={light} className="w-full object-cover dark:hidden" alt="Dashboard preview" />
          <img src={dark} className="hidden w-full object-cover dark:block" alt="Dashboard preview" />
        </div>
      </div>
    </div>
  );
};

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title = "Now in Beta",
      subtitle = {
        regular: "Your personal library",
        gradient: "for everything you find.",
      },
      description =
        "You come across good things every day, from sharp headlines to product pages and images that stop your scroll. Clippit saves it all and brings it back when you need it.",
      ctaText = "Start saving",
      ctaHref = "/sign-up",
      bottomImage = {
        light: "https://farmui.vercel.app/dashboard-light.png",
        dark: "https://farmui.vercel.app/dashboard.png",
      },
      gridOptions,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("relative border-b border-border", className)} ref={ref} {...props}>
        <section className="relative mx-auto flex min-h-[90vh] md:min-h-[calc(100vh-73px)] w-full max-w-6xl flex-col items-center justify-center px-5 pt-24 pb-12 md:pt-40 md:pb-20 text-center md:px-8">
          <RetroGrid {...gridOptions} />
          <div className="absolute top-16 md:top-16 left-1/2 z-0 h-[24rem] w-full max-w-3xl -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
            <div className="rounded-full border border-border bg-card px-4 py-2 hover:bg-muted/50 transition-colors cursor-default transition-all shadow-sm">
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.28em] text-primary">{title}</p>
            </div>

            <div className="mt-8 md:mt-4 flex flex-col items-center gap-8 md:gap-4 px-1">
              <h1 className="mx-auto font-serif text-[clamp(2.75rem,12vw,4.2rem)] md:text-[6.5rem] leading-[1.05] md:leading-[1.14] tracking-[-0.05em] text-foreground text-balance md:text-wrap md:pb-3">
                <span className="block md:whitespace-nowrap">{subtitle.regular}</span>
                <span className="block pb-[0.1em] md:pb-[0.08em] bg-linear-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent drop-shadow-sm md:whitespace-nowrap">
                  {subtitle.gradient}
                </span>
              </h1>

              <p className="mx-auto max-w-xl md:max-w-3xl text-[15px] md:text-lg leading-relaxed md:leading-8 text-muted-foreground/80 md:text-muted-foreground px-4 md:px-0">
                <span className="md:hidden">
                  Clippit saves the links, pages, and images that stop your scroll. Access them instantly, anywhere.
                </span>
                <span className="hidden md:inline">
                  {description}
                </span>
              </p>
            </div>

            <div className="mt-6 sm:mt-8">
              <Link
                href={ctaHref}
                className="inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                {ctaText}
              </Link>
            </div>

            {/* {bottomImage && <HeroImage light={bottomImage.light} dark={bottomImage.dark} />} */}
          </div>
        </section>
      </div>
    );
  },
);

HeroSection.displayName = "HeroSection";

export { HeroSection };
