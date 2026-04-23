import { Zap, Globe, FolderKanban, Search, Users, Download } from "lucide-react";

export function Features() {
  const primaryFeature = {
    title: "Your library. Always within reach.",
    body: "Everything you save stays organized without you doing anything. Come back a day later or three months later and it is all still there, exactly where you left it.",
  };

  const bentoFeatures = [
    {
      icon: Zap,
      title: "Fast capture",
      body: "Save anything in seconds without breaking what you were doing.",
      className: "col-span-1",
    },
    {
      icon: Globe,
      title: "Works on every site",
      body: "The bookmarklet works on any website, any browser, any page.",
      className: "col-span-1",
    },
    {
      icon: FolderKanban,
      title: "Smart collections",
      body: "Organize content into collections. Share them with your team when you want to.",
      className: "col-span-1",
    },
    {
      icon: Search,
      title: "AI search",
      body: "Describe what you're looking for in plain English. Clippit finds it.",
      className: "col-span-1",
    },
    {
      icon: Users,
      title: "Team collaboration",
      body: "Invite people to your collections. They can view, add, and edit. Simple permissions, no complexity.",
      className: "col-span-1 md:col-span-1 lg:col-span-2",
    },
    {
      icon: Download,
      title: "Export your data",
      body: "Download everything you've saved as a clean JSON file. Your data is always yours.",
      className: "col-span-1 md:col-span-1 lg:col-span-2",
    },
  ];

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Core advantage
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Primary Hero Card */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-2xl border border-border/60 bg-card p-8 md:p-10 flex flex-col justify-between hover:bg-muted/30 transition-colors duration-300">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.03em] text-foreground">
                {primaryFeature.title}
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground lg:max-w-[400px]">
                {primaryFeature.body}
              </p>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-2">
              {["One click save", "Smart collections", "AI search", "Team sharing", "No folders needed", "Always searchable"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-background border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Secondary Bento Cards */}
          {bentoFeatures.map((feature) => (
            <div
              key={feature.title}
              className={`rounded-2xl border border-border/60 bg-card p-8 flex flex-col justify-center hover:bg-muted/30 transition-colors duration-300 ${feature.className}`}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground tracking-tight">
                {feature.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
