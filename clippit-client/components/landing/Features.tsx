import { Globe, Brain, Zap, Tag, Moon, Shield } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Works everywhere",
      body: "One bookmarklet on every browser and every website.",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Understands meaning",
      body: "Search by describing what you want. Not by remembering what you typed.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Background processing",
      body: "AI runs in the background. Your workflow is never interrupted.",
    },
    {
      icon: <Tag className="w-5 h-5" />,
      title: "Auto tagged",
      body: "Every save gets tagged automatically. You never organize anything manually.",
    },
    {
      icon: <Moon className="w-5 h-5" />,
      title: "Dark mode",
      body: "Looks good at any hour.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Private by default",
      body: "Everything you save stays in your account. No ads, no tracking, no sharing.",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-foreground/[0.02]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
            What you get
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Built around how creators actually work
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="bg-primary/10 rounded-lg p-2 w-9 h-9 mb-3 flex items-center justify-center text-primary">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
