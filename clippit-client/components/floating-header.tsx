import Link from "next/link";

const navItems = [
  { label: "How it works", href: "#workflow" },
  { label: "Features", href: "#features" },
  { label: "Why Clippit", href: "#why-clippit" },
];

export function FloatingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="font-mono text-sm uppercase tracking-[0.28em] text-primary">
          Clippit
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-card"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Start free
          </Link>
        </div>
      </nav>
    </header>
  );
}
