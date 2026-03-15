"use client";

import { usePathname } from "next/navigation";
import { Search, X, Menu, Sun, Moon } from "lucide-react";
import { useSearchContext } from "@/lib/context/SearchContext";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const { setTheme, theme, resolvedTheme } = useTheme();
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
    if (path.startsWith("/items/")) return "Item Details";
    return "Clippit";
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearSearch();
  };

  // Prevent hydration tilt
  if (!mounted) return (
    <header className="h-14 lg:h-16 bg-background border-b border-border flex items-center px-4 lg:px-6 w-full shrink-0" />
  );

  return (
    <header className="h-14 lg:h-16 bg-background border-b border-border flex items-center px-4 lg:px-6 sticky top-0 z-20 w-full shrink-0 justify-between gap-4">
      {/* Mobile Menu & Page Title */}
      <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1 sm:flex-initial">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 -ml-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight truncate">
          {getPageTitle(pathname)}
        </h1>
      </div>

      {/* Search Bar (Center) - Only on Dashboard */}
      {isDashboard ? (
        <div className="flex flex-1 max-w-xl mx-auto px-2 sm:px-4">
          <div className="relative group transition-all duration-300 w-full">
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground group-focus-within:text-primary"
              }`}
            />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-20 rounded-full text-sm transition-all duration-200 outline-none border border-border bg-muted hover:bg-muted/80 focus:bg-background focus:border-primary focus:ring-1 focus:ring-ring shadow-sm"
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 h-full">
              {!isActive && (
                <kbd className="hidden lg:flex items-center gap-1 font-mono text-[10px] font-medium text-muted-foreground bg-background border border-border px-1.5 py-0.5 rounded opacity-70 pointer-events-none transition-opacity group-focus-within:opacity-0">
                  <span className="text-xs">⌘</span>K
                </kbd>
              )}

              {isActive && (
                <div className="flex items-center gap-1 mr-0.5 pointer-events-auto h-full py-1">
                  {!isSearching && (
                    <span className="hidden lg:inline text-[9px] font-bold uppercase tracking-tight text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
                      {resultCount}
                    </span>
                  )}
                  {isSearching && (
                    <span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin mr-1" />
                  )}
                  <button
                    onClick={handleClear}
                    className="p-1 rounded-full text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground transition-all active:scale-95"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 sm:hidden lg:flex" />
      )}

      {/* Right side (Desktop Theme Toggle) */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border/50">
          <Sun className={`h-4 w-4 transition-colors ${resolvedTheme === "light" ? "text-amber-500" : "text-muted-foreground"}`} />
          <Switch
            checked={resolvedTheme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            className="data-[state=checked]:bg-primary"
          />
          <Moon className={`h-4 w-4 transition-colors ${resolvedTheme === "dark" ? "text-blue-400" : "text-muted-foreground"}`} />
        </div>
        
        {/* Mobile-only toggle (no switch, just icon button) */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="sm:hidden p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border/50"
        >
          {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
