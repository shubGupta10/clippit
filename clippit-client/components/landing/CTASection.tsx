import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="rounded-[2.5rem] border border-border bg-card px-6 py-10 text-center md:px-12 md:py-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Start saving today
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight tracking-[-0.03em] text-foreground md:text-6xl">
            Everything you find deserves a place to live.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            You come across good things every day. Now you have somewhere to put
            them.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
