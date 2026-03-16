export function Features() {
  const primaryFeature = {
    title: "Your library. Always within reach.",
    body: "Everything you save stays organized without you doing anything. Come back a day later or three months later and it is all still there, exactly where you left it.",
  };

  const secondaryFeatures = [
    {
      title: "Fast capture",
      body: "Save anything in seconds without breaking what you were doing.",
    },
    {
      title: "Works on every site",
      body: "The bookmarklet works on any website, any browser, any page.",
    },
    {
      title: "Stays useful over time",
      body: "Your library grows with you. Something saved six months ago is just as easy to find today.",
    },
    {
      title: "Calm organization",
      body: "Nothing to organize, tag, or sort. Save it and forget about the admin work.",
    },
  ];

  return (
    <section id="features" className="border-b border-border py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Core advantage
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="rounded-[2rem] border border-border bg-card p-8">
            <h3 className="mt-10 max-w-lg font-serif text-4xl leading-tight tracking-[-0.03em] text-foreground">
              {primaryFeature.title}
            </h3>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              {primaryFeature.body}
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["One click save", "No folders needed", "Always searchable"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-background px-4 py-4 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {secondaryFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[1.5rem] border border-border bg-card p-6"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">
                  Feature
                </p>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
