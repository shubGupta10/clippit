import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--landing-border)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-sm text-[var(--landing-muted)] md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--landing-accent)]">
            Clippit
          </p>
          <p className="mt-2">
            Research capture and retrieval for product, design, and marketing
            teams.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <Link
            href="/sign-in"
            className="transition-colors hover:text-[var(--landing-text)]"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="transition-colors hover:text-[var(--landing-text)]"
          >
            Start free
          </Link>
          <a
            href="mailto:hello@clippit.app"
            className="transition-colors hover:text-[var(--landing-text)]"
          >
            hello@clippit.app
          </a>
        </div>
      </div>
    </footer>
  );
}
