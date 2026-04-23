import Link from "next/link";

export function MidPageCTA() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <div className="rounded-2xl border border-border/60 bg-card p-8 md:p-12 flex flex-col items-center gap-6">
          <h3 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">
            Ready to try it?
          </h3>
          <p className="text-muted-foreground text-base max-w-md">
            It takes 30 seconds to set up. Save your first link today.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex rounded-full bg-foreground px-8 py-3.5 text-sm font-bold text-background transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            Start saving for free
          </Link>
        </div>
      </div>
    </section>
  );
}
