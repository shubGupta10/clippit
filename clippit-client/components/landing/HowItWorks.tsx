export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Find something worth saving",
      body: "You are browsing and come across something good. A headline, an ad, an image, a page.",
    },
    {
      number: "02",
      title: "Click and save",
      body: "Click the bookmarklet in your browser. Pick text, an image, or the whole page. Takes three seconds.",
    },
    {
      number: "03",
      title: "Find it when you need it",
      body: "Open Clippit and everything you saved is right there. Search by keyword or scroll through your library.",
    },
  ];

  return (
    <section id="workflow" className="border-b border-border py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-14 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            How it works
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight tracking-[-0.02em] text-foreground md:text-5xl">
            Three steps. That is it.
          </h2>
        </div>
        <div className="rounded-[2rem] border border-border bg-card p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-[1.5rem] border border-border bg-background p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                    {step.number}
                  </p>
                  <span className="h-px w-12 bg-border" />
                </div>
                <h3 className="mt-10 text-2xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
