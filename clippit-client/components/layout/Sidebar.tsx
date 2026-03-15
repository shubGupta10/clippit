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
        fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        lg:translate-x-0 lg:shadow-none
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

      <nav className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
        <Link
          href="/setup"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all text-sm rounded-xl border ${
            pathname === "/setup"
              ? "bg-primary text-primary-foreground font-bold border-primary shadow-sm"
              : "border-transparent text-muted-foreground/90 hover:bg-muted hover:text-foreground"
          }`}
        >
          <Settings2 className="h-5 w-5 shrink-0" />
          Setup
        </Link>
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all text-sm rounded-xl border ${
            pathname === "/dashboard"
              ? "bg-primary text-primary-foreground font-bold border-primary shadow-sm"
              : "border-transparent text-muted-foreground/90 hover:bg-muted hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          Dashboard
        </Link>
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all text-sm rounded-xl border ${
            pathname === "/settings"
              ? "bg-primary text-primary-foreground font-bold border-primary shadow-sm"
              : "border-transparent text-muted-foreground/90 hover:bg-muted hover:text-foreground"
          }`}
        >
          <Settings2 className="h-5 w-5 shrink-0" />
          Settings
        </Link>
      </nav>

      {/* Footer: user + theme */}
      <div className="p-4 border-t border-border flex flex-col gap-3 shrink-0">
        {user && (
          <div className="flex items-center justify-between bg-muted/30 p-2 rounded-xl border border-border/50">
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
              <span className="text-sm font-semibold text-foreground truncate">
                {user.fullName || user.username || "User"}
              </span>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="p-2 text-muted-foreground hover:text-destructive transition-all shrink-0 rounded-lg hover:bg-destructive/10 active:scale-95"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="lg:hidden flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-all active:scale-95 group"
          >
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Light mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-blue-400" />
                  <span>Dark mode</span>
                </>
              )}
            </div>
            <div className="w-8 h-4 rounded-full bg-border/40 relative">
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-[18px]' : 'left-0.5'}`} />
            </div>
          </button>
        )}
      </div>
    </aside>
  );
}