import Link from "next/link";
import { Check, Sparkles, Zap } from "lucide-react";

const freePlanFeatures = [
  "Unlimited saves",
  "AI-powered search",
  "Smart collections",
  "Team collaboration",
  "Browser bookmarklet",
  "Auto-tagging",
  "Export data as JSON",
];

const proPlanFeatures = [
  "Everything in Free",
  "More saves per month",
  "Priority support",
  "Export as CSV & Markdown",
  "More features based on user feedback",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">
            Simple pricing
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-[-0.04em] text-foreground text-balance leading-[1.1]">
            Free while we build.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Clippit is completely free during early access. A Pro plan with advanced features is on the way.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          
          {/* Free Plan */}
          <div className="relative rounded-2xl border border-border/60 bg-card p-8 md:p-10 flex flex-col hover:border-primary/30 transition-all duration-500 group">
            
            {/* Badge */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4.5 h-4.5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground tracking-tight">Early Access</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                Current
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-foreground tracking-tight">$0</span>
                <span className="text-muted-foreground text-sm font-medium">/month</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Free forever during early access
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3.5 mb-10 flex-1">
              {freePlanFeatures.map((feature) => (
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
              className="w-full inline-flex items-center justify-center rounded-xl bg-foreground text-background py-3.5 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Get started free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border border-primary/20 bg-card p-8 md:p-10 flex flex-col transition-all duration-500 group overflow-hidden">
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.06] pointer-events-none" />
            
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Badge */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight">Pro</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                  Coming soon
                </span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-foreground/40 tracking-tight">$—</span>
                  <span className="text-muted-foreground/50 text-sm font-medium">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground/70">
                  Pricing announced soon
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3.5 mb-10 flex-1">
                {proPlanFeatures.map((feature, i) => (
                  <li key={feature} className={`flex items-center gap-3 text-[14px] ${i === 0 ? "text-foreground/80" : "text-foreground/50"}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? "bg-primary/10" : "bg-muted"}`}>
                      <Check className={`w-3 h-3 ${i === 0 ? "text-primary" : "text-muted-foreground/60"}`} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                disabled
                className="w-full inline-flex items-center justify-center rounded-xl border border-border bg-muted/50 text-muted-foreground py-3.5 text-sm font-bold cursor-not-allowed opacity-70"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-center text-xs text-muted-foreground/60 font-medium">
          No credit card required • No usage limits during early access
        </p>
      </div>
    </section>
  );
}
