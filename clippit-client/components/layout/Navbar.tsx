"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

interface NavbarProps {
  onSearch: (query: string) => void;
  resultCount?: number;
  isSearching?: boolean;
}

export function Navbar({ onSearch, resultCount, isSearching }: NavbarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isActive = query.trim().length > 0;
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const timer = setTimeout(() => { onSearch(query); }, 500);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K on Mac, Ctrl+K on Windows
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClear = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  const getPageTitle = (path: string | null) => {
    if (!path || path === "/") return "Dashboard";
    if (path.includes("/setup")) return "Setup";
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/items/")) return "Item Details";
    const segment = path.split("/").filter(Boolean)[0];
    if (segment) {
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
    return "Dashboard";
  };

  return (
    <header className="h-14 lg:h-16 bg-background border-b border-border flex items-center px-4 lg:px-6 sticky top-0 z-10 w-full shrink-0 justify-between">
      {/* Page Title (Left) */}
      <div className="flex-1 hidden sm:flex items-center">
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          {getPageTitle(pathname)}
        </h1>
      </div>

      {/* Search Bar (Center) */}
      <div className="flex-1 shrink-0 w-full max-w-xl sm:absolute sm:left-1/2 sm:-translate-x-1/2 px-0 sm:px-4">
        <div className="relative group transition-all duration-300 w-full">
          <Search
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground group-focus-within:text-foreground"
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full h-10 pl-10 pr-24 rounded-full text-sm transition-all duration-200 outline-none border border-border bg-muted/60 hover:bg-muted focus:bg-background focus:border-primary focus:ring-1 focus:ring-ring"
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 h-full">
            {!isActive && (
              <kbd className="hidden sm:flex items-center gap-1 font-mono text-[10px] font-medium text-muted-foreground bg-background border border-border px-1.5 py-0.5 rounded opacity-70 pointer-events-none transition-opacity group-focus-within:opacity-0">
                <span className="text-xs">⌘</span>K
              </kbd>
            )}

            {isActive && (
              <div className="flex items-center gap-1.5 mr-1 pointer-events-auto h-full py-1">
                {!isSearching && resultCount !== undefined && (
                  <span className="hidden sm:inline text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                    {resultCount} {resultCount === 1 ? "result" : "results"}
                  </span>
                )}
                {isSearching && (
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin mr-1" />
                )}
                <button
                  onClick={handleClear}
                  className="p-1 rounded-full text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground transition-all active:scale-95"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side (Desktop Theme Toggle) */}
      <div className="flex-1 hidden sm:flex justify-end items-center gap-2">
        {mounted && (
          <div className="flex items-center gap-2 border border-border bg-muted/30 px-2.5 py-1.5 rounded-full shadow-sm">
            <Sun className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-muted-foreground' : 'text-amber-500'}`} />
            <Switch 
              checked={theme === "dark"}
              onCheckedChange={(checked: boolean) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle theme"
            />
            <Moon className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
        )}
      </div>
    </header>
  );
}
