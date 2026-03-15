import { Bookmark, Sparkles, Search } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Bookmark className="w-6 h-6 text-primary" />,
      title: "Save in seconds",
      body: "Click the bookmarklet on any page. Pick text, an image, or the whole page. Done.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: "AI processes it",
      body: "Every save gets embedded by AI in the background. It understands meaning, not just keywords.",
    },
    {
      icon: <Search className="w-6 h-6 text-primary" />,
      title: "Search in plain English",
      body: "Type what you are looking for. Not tags. Not filters. Just describe it and Clippit finds it.",
    },
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Three steps. That is it.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-200 flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
