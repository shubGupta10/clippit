import { Bookmark, Search, FolderOpen } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: Bookmark,
      title: "Find something worth saving",
      description: "You're browsing and you see something good. An article, a design, a product page. Instead of losing it in 47 open tabs, you save it."
    },
    {
      number: 2,
      icon: FolderOpen,
      title: "Click the bookmarklet",
      description: "One click from your bookmarks bar. The page, image, or text gets saved to your Clippit library. No copy-pasting, no screenshots."
    },
    {
      number: 3,
      icon: Search,
      title: "Search and find it later",
      description: "Type what you remember in plain English. Clippit uses AI to find the exact thing you saved, even if you forgot the title."
    },
  ];

  return (
    <section id="workflow" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-20 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            How it works
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.02em] text-foreground md:text-5xl">
            Three steps. That's it.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Save anything from anywhere in seconds. Find it instantly when you need it.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 relative">
          {/* Subtle connecting thread for desktop */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-px bg-border z-0" />
          
          {steps.map((step) => (
            <div 
              key={step.number} 
              className="relative z-10 rounded-3xl border border-border bg-card p-8 md:p-10 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md"
            >
              {/* Massive background watermark number */}
              <div className="absolute -right-4 -bottom-8 text-[10rem] lg:text-[14rem] font-serif font-black text-foreground opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none select-none leading-none">
                {step.number}
              </div>
              
              <div className="relative z-10">
                {/* Step pill indicator with icon */}
                <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border shadow-sm">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
                  {step.title}
                </h3>
                
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
