"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, X, Menu, Sun, Moon } from "lucide-react";
import { useSearchContext } from "@/lib/context/SearchContext";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const { 
    searchQuery, 
    setSearchQuery, 
    clearSearch, 
    searchResults, 
    isSearching 
  } = useSearchContext();

  useEffect(() => setMounted(true), []);

  const isDashboard = pathname === "/dashboard";
  const isActive = searchQuery.length > 0;
  const resultCount = searchResults.length;

  const getPageTitle = (path: string) => {
    if (path === "/dashboard") return "Dashboard";
    if (path === "/setup") return "Setup";
    if (path === "/settings") return "Settings";
    if (path === "/collections") return "Collections";
    if (path.startsWith("/items/")) return "Item Details";
    return "Clippit";
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearSearch();
  };

  if (!mounted) return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 lg:px-6 w-full shrink-0" />
  );

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 lg:px-6 sticky top-0 z-20 w-full shrink-0 justify-between gap-4">
      {/* Mobile Menu & Page Title */}
      <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1 sm:flex-initial">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 -ml-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-foreground tracking-tight truncate">
          {getPageTitle(pathname)}
        </h1>
      </div>

      {/* Search Bar - Only on Dashboard */}
      {isDashboard ? (
        <div className="flex flex-1 max-w-lg mx-auto px-2 sm:px-4">
          <div className="relative group w-full">
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-20 rounded-full text-sm outline-none border border-border bg-muted hover:bg-muted focus:bg-background focus:border-primary focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground shadow-sm transition-all duration-200"
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {!isActive && (
                <kbd className="hidden lg:flex items-center gap-0.5 font-mono text-[9px] font-medium text-muted-foreground bg-background border border-border px-1.5 py-0.5 rounded opacity-70 pointer-events-none group-focus-within:opacity-0 transition-opacity">
                  <span className="text-[10px]">⌘</span>K
                </kbd>
              )}

              {isActive && (
                <div className="flex items-center gap-1 pointer-events-auto py-1">
                  {!isSearching && (
                    <span className="hidden lg:inline text-[9px] font-bold uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                      {resultCount}
                    </span>
                  )}
                  {isSearching && (
                    <span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin mr-1" />
                  )}
                  <button
                    onClick={handleClear}
                    className="p-0.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 sm:hidden lg:flex" />
      )}

      {/* Theme Toggle */}
      <div className="flex items-center shrink-0">
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors border border-border"
          title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        >
          {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
