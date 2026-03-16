export function WhyYouNeed() {
  const withoutClippit = [
    "Good things get saved in random tabs that never reopen.",
    "Screenshots pile up with no way to find the right one later.",
    "You remember seeing something perfect but cannot find it again.",
  ];

  const withClippit = [
    "Everything saved in one place, always findable.",
    "No more digging through folders, tabs, or camera rolls.",
    "What you saved last week is just as easy to find as what you saved today.",
  ];

  return (
    <section id="why-clippit" className="border-b border-border py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)_minmax(0,1.05fr)] md:px-8">
        <div className="rounded-[2rem] border border-border bg-card p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Why you need it
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.03em] text-foreground">
            Tabs close. Screenshots pile up. Good things disappear.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            You find something worth keeping every single day. But there is
            nowhere good to put it. Clippit is that place.
          </p>
        </div>
        <div className="rounded-[2rem] border border-border bg-card p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">
            Without Clippit
          </p>
          <ul className="mt-6 space-y-4">
            {withoutClippit.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-border bg-background px-4 py-4 text-sm leading-7 text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[2rem] border border-border bg-card p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">
            With Clippit
          </p>
          <ul className="mt-6 space-y-4">
            {withClippit.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-border bg-background px-4 py-4 text-sm leading-7 text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
