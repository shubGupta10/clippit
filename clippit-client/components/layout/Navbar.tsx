"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center px-6 sticky top-0 z-10 w-full shrink-0">
      <div className="max-w-2xl w-full mx-auto relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your saved items..."
          className="w-full h-10 pl-10 pr-10 bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all text-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}
