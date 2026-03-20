import { AlertCircle, CheckCircle2, Bookmark, Flame } from "lucide-react";

export function WhyYouNeed() {
  const problems = [
    "Random tabs get lost and never reopen.",
    "Screenshots pile up with bad names.",
    "You remember reading it, but can't find it."
  ];

  const solutions = [
    "Everything saved in one structured place.",
    "Smart collections organize automatically.",
    "Find it instantly with AI search."
  ];

  return (
    <section id="why-clippit" className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-20 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Why you need it
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.02em] text-foreground md:text-5xl">
            The web is full of gems. Stop losing them.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* CHAOS PANEL - Without Clippit */}
          <div className="rounded-[2.5rem] border border-border bg-card/60 p-8 md:p-12 flex flex-col items-center">
            {/* Visual representation of chaos */}
            <div className="relative w-full h-56 mb-10 flex items-center justify-center">
              <div className="absolute w-44 h-24 rounded-2xl border border-border bg-background shadow-md -rotate-[16deg] -translate-x-12 translate-y-6 flex flex-col p-4 opacity-70">
                <div className="w-1/2 h-2.5 bg-muted rounded-full mb-3" />
                <div className="w-3/4 h-2 bg-muted/60 rounded-full mb-2" />
                <div className="w-2/3 h-2 bg-muted/60 rounded-full" />
              </div>
              
              <div className="absolute w-44 h-24 rounded-2xl border border-border bg-background shadow-md rotate-[12deg] translate-x-14 -translate-y-6 flex flex-col p-4 opacity-50">
                <div className="w-3/4 h-2.5 bg-muted rounded-full mb-3" />
                <div className="w-full h-2 bg-muted/60 rounded-full mb-2" />
                <div className="w-5/6 h-2 bg-muted/60 rounded-full" />
              </div>
              
              <div className="absolute w-48 h-28 rounded-2xl border border-destructive/30 bg-card shadow-2xl rotate-3 -translate-y-2 z-10 flex flex-col items-center justify-center gap-3">
                 <AlertCircle className="w-8 h-8 text-destructive/50" />
                 <span className="text-xs font-mono uppercase tracking-widest text-destructive/50">Lost link</span>
              </div>
            </div>

            <h3 className="font-serif text-3xl font-bold text-foreground mb-8">Without Clippit</h3>
            <ul className="space-y-5 text-left w-full max-w-md mx-auto">
              {problems.map((problem, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-2.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-destructive/60" />
                  <span className="text-muted-foreground leading-relaxed text-base">{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CALM PANEL - With Clippit */}
          <div className="rounded-[2.5rem] border border-primary/20 bg-primary/5 p-8 md:p-12 flex flex-col items-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />

            {/* Visual representation of calm */}
            <div className="relative w-full h-56 mb-10 flex flex-col gap-4 items-center justify-center">
              
              <div className="w-64 h-14 rounded-2xl border border-primary/20 bg-background shadow-sm flex items-center px-4 gap-4 z-10 transition-transform duration-500 hover:scale-[1.02] hover:-translate-y-1">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                   <Bookmark className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1 mt-0.5">
                   <div className="h-2 w-28 bg-foreground/80 rounded-full" />
                   <div className="h-1.5 w-16 bg-muted-foreground/50 rounded-full" />
                </div>
              </div>
              
              <div className="w-64 h-14 rounded-2xl border border-primary/20 bg-background shadow-sm flex items-center px-4 gap-4 z-10 transition-transform duration-500 hover:scale-[1.02] hover:-translate-y-1">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                   <Bookmark className="w-4 h-4" />
                </div>
                 <div className="flex flex-col gap-1.5 flex-1 mt-0.5">
                   <div className="h-2 w-32 bg-foreground/80 rounded-full" />
                   <div className="h-1.5 w-20 bg-muted-foreground/50 rounded-full" />
                </div>
              </div>
              
              <div className="w-64 h-14 rounded-2xl border border-primary/20 bg-background shadow-sm flex items-center px-4 gap-4 z-10 transition-transform duration-500 hover:scale-[1.02] hover:-translate-y-1">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                   <Flame className="w-4 h-4" />
                </div>
                 <div className="flex flex-col gap-1.5 flex-1 mt-0.5">
                   <div className="h-2 w-24 bg-foreground/80 rounded-full" />
                   <div className="h-1.5 w-12 bg-muted-foreground/50 rounded-full" />
                </div>
              </div>
            </div>

            <h3 className="font-serif text-3xl font-bold text-foreground mb-8">With Clippit</h3>
            <ul className="space-y-5 text-left w-full max-w-md mx-auto relative z-10">
              {solutions.map((solution, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1.5 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-foreground leading-relaxed text-base font-medium">{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
