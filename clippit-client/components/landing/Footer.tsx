import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 py-8 md:py-12 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 md:px-8 flex flex-col items-center gap-6 md:flex-row md:justify-between md:items-center">
        
        {/* Left Side: Logo & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link href="/" className="inline-flex items-center group transition-opacity hover:opacity-90">
            <span className="font-serif text-xl tracking-tighter text-foreground">
              Clippit
            </span>
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/30">
            © {currentYear} Clippit
          </p>
        </div>

        {/* Right Side: Essential Links */}
        <div className="flex items-center gap-6 md:gap-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          <a href="mailto:hello@clippit.app" className="hover:text-foreground transition-colors">Email</a>
        </div>

      </div>
    </footer>
  );
}
