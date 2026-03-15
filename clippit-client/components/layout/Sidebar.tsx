"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useUser, useClerk } from "@clerk/nextjs";
import { Bookmark, LayoutDashboard, Settings2, Sun, Moon, LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose?.();
  }, [pathname]);

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col z-30
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between border-b border-border h-16 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 rounded-lg p-1.5">
            <Bookmark className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">Clippit</span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto w-[calc(100%+2px)] -ml-[1px]">
        <Link
          href="/setup"
          className={`flex items-center gap-3 px-3 py-2.5 transition-colors text-sm rounded-r-lg ${
            pathname === "/setup"
              ? "border-l-2 border-primary bg-accent text-accent-foreground font-medium"
              : "border-l-2 border-transparent text-muted-foreground hover:border-border hover:bg-accent/30 hover:text-foreground"
          }`}
        >
          <Settings2 className="h-5 w-5 shrink-0" />
          Setup
        </Link>
        <Link
          href="/dashboard"
          className={`flex items-center justify-between px-3 py-2.5 transition-colors text-sm rounded-r-lg ${
            pathname === "/dashboard"
              ? "border-l-2 border-primary bg-accent text-accent-foreground font-medium"
              : "border-l-2 border-transparent text-muted-foreground hover:border-border hover:bg-accent/30 hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            Dashboard
          </div>
        </Link>
      </nav>

      {/* Footer: user + theme */}
      <div className="p-4 border-t border-border flex flex-col gap-3 shrink-0">
        {user && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="User avatar"
                  className="h-8 w-8 rounded-full bg-muted object-cover shrink-0 ring-2 ring-border"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted shrink-0 ring-2 ring-border" />
              )}
              <span className="text-sm font-medium text-foreground truncate">
                {user.fullName || user.username || "User"}
              </span>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="p-2 text-muted-foreground hover:text-destructive transition-all shrink-0 rounded-md hover:bg-destructive/10 active:scale-95"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex lg:hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all p-2 rounded-lg hover:bg-muted w-full active:scale-95 group"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4 group-hover:rotate-45 transition-transform" />
                <span>Light mode</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 group-hover:-rotate-12 transition-transform" />
                <span>Dark mode</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}