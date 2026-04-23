import Link from "next/link";
import { Check, Zap } from "lucide-react";

const features = [
  "Up to 100 saves",
  "3 personal collections",
  "2 shared collections",
  "AI search",
  "Browser bookmarklet",
  "Export data as JSON",
  "Invite team members",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">
            Simple pricing
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-[-0.04em] text-foreground text-balance leading-[1.1]">
            Free while we build.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Everything is free during early access. No limits on features, no credit card, no catch. A paid plan will come later with higher limits.
          </p>
        </div>

        {/* Single Pricing Card */}
        <div className="relative rounded-2xl border border-primary/20 bg-card p-8 md:p-12 flex flex-col items-center max-w-lg mx-auto overflow-hidden group">
          
          {/* Subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.06] pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full flex flex-col items-center">
            {/* Badge */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">Early Access</h3>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest ml-2">
                Free
              </span>
            </div>

            {/* Price */}
            <div className="mb-8 text-center">
              <div className="flex items-baseline gap-1 justify-center">
                <span className="text-6xl font-bold text-foreground tracking-tight">$0</span>
                <span className="text-muted-foreground text-sm font-medium">/month</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                No credit card required
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3.5 mb-10 w-full max-w-xs">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-[14px] text-foreground/80">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/sign-up"
              className="w-full max-w-xs inline-flex items-center justify-center rounded-xl bg-foreground text-background py-3.5 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Get started free
            </Link>
          </div>
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center text-xs text-muted-foreground/50 font-medium">
          Pro plan with higher limits coming later. Early access users will get a discount.
        </p>
      </div>
    </section>
  );
}
