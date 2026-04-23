import Link from "next/link";
import { Menu } from "lucide-react";

const navItems = [
  { label: "How it works", href: "#workflow" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export function FloatingHeader() {
  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none">
      <nav className="flex w-full max-w-5xl items-center justify-between rounded-full border border-border/40 bg-background/60 px-4 py-2 backdrop-blur-2xl shadow-lg pointer-events-auto transition-all">
        
        {/* Left: Logo */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-foreground pl-2 py-2 transition-opacity hover:opacity-80">
            Clippit
          </Link>
        </div>
        
        {/* Center: Desktop Nav */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        {/* Right: Actions */}
        <div className="flex flex-1 justify-end items-center gap-2">
          <Link
            href="/sign-in"
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/40"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-transform hover:scale-105 active:scale-95"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
