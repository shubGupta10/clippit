"use client";

import { Bookmark, Menu } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b border-border flex items-center px-4 z-30">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        <Bookmark className="h-5 w-5 text-primary" />
        <span className="text-lg font-bold text-foreground tracking-tight">Clippit</span>
      </div>
    </header>
  );
}
