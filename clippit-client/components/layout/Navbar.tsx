"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface NavbarProps {
  onSearch: (query: string) => void;
  resultCount?: number;
  isSearching?: boolean;
}

export function Navbar({ onSearch, resultCount, isSearching }: NavbarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isActive = query.trim().length > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center px-6 sticky top-0 z-10 w-full shrink-0">
      <div className="max-w-2xl w-full mx-auto relative group">
        {/* Search icon — spins to indicate activity */}
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
            isActive ? "text-primary" : "text-muted-foreground group-focus-within:text-foreground"
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your saved items..."
          className={`w-full h-10 pl-9 pr-10 rounded-md text-sm transition-all outline-none border ${
            isActive
              ? "bg-background border-primary ring-2 ring-primary/20"
              : "bg-muted/50 border-border focus:ring-2 focus:ring-primary focus:bg-background focus:border-primary"
          }`}
        />

        {/* Right side: either result count pill or clear button */}
        {isActive && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {!isSearching && resultCount !== undefined && (
              <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                {resultCount} {resultCount === 1 ? "result" : "results"}
              </span>
            )}
            {isSearching && (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            )}
            <button
              onClick={handleClear}
              className="p-0.5 text-muted-foreground hover:text-foreground transition-colors rounded"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
