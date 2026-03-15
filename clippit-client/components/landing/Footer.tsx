import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div>
          &copy; 2026 Clippit
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="#"
            className="hover:text-foreground transition-colors min-h-[44px] flex items-center justify-center p-2 -m-2"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="hover:text-foreground transition-colors min-h-[44px] flex items-center justify-center p-2 -m-2"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
