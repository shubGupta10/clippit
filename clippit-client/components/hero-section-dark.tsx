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
        <section className="relative mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl flex-col px-5 pt-16 pb-16 text-center md:px-8 md:pt-20">
          <RetroGrid {...gridOptions} />
          <div className="absolute top-16 left-1/2 z-0 h-[24rem] w-full max-w-3xl -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
            <div className="rounded-full border border-border bg-card px-4 py-2">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">{title}</p>
            </div>

            <div className="mt-4 space-y-4">
              <h1 className="mx-auto pb-3 font-serif text-[4.2rem] leading-[1.16] tracking-[-0.05em] text-foreground md:text-[6.5rem] md:leading-[1.14]">
                <span className="block md:whitespace-nowrap">{subtitle.regular}</span>
                <span className="block pb-[0.08em] bg-linear-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent md:whitespace-nowrap">
                  {subtitle.gradient}
                </span>
              </h1>

              <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p>
            </div>

            <div className="mt-8">
              <Link
                href={ctaHref}
                className="inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                {ctaText}
              </Link>
            </div>

            {bottomImage && (
              <div className="mt-14 w-full max-w-5xl px-2 md:px-6">
                <img
                  src={bottomImage.light}
                  className="w-full rounded-2xl border border-border shadow-2xl dark:hidden"
                  alt="Dashboard preview"
                />
                <img
                  src={bottomImage.dark}
                  className="hidden w-full rounded-2xl border border-border shadow-2xl dark:block"
                  alt="Dashboard preview"
                />
              </div>
            )}
          </div>
        </section>
      </div>
    );
  },
);

HeroSection.displayName = "HeroSection";

export { HeroSection };
