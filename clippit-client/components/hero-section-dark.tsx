import Link from "next/link";

export function HeroSection() {
  return (
    <section className="flex min-h-[calc(100vh-73px)] items-start border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-5 pt-20 pb-16 text-center md:px-8 md:pt-24">
        <div className="rounded-full border border-border bg-card px-4 py-2">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
            Now in Beta
          </p>
        </div>
        <div className="mt-8 space-y-5">
          <h1 className="mx-auto pb-4 font-serif text-[4.2rem] leading-[1.08] tracking-[-0.05em] text-foreground md:text-[6.5rem]">
            <span className="block md:whitespace-nowrap">Your personal library</span>
            <span className="block bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent md:whitespace-nowrap">
              for everything you find.
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
            You come across good things every day. A well written headline. A
            product page that converts. An image that stops you mid scroll.
            Clippit saves it all and brings it back when you actually need it.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/sign-up"
            className="inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Start saving
          </Link>
        </div>
      </div>
    </section>
  );
}
