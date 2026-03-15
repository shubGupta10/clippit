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
        <div className="flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-primary" />
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
      <nav className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
        <Link
          href="/setup"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
            pathname === "/setup"
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          }`}
        >
          <Settings2 className="h-5 w-5 shrink-0" />
          Setup
        </Link>
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
            pathname === "/dashboard"
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          Dashboard
        </Link>
      </nav>

      {/* Footer: user + theme */}
      <div className="p-4 border-t border-border flex flex-col gap-3 shrink-0">
        {user && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="User avatar"
                  className="h-8 w-8 rounded-full bg-muted object-cover shrink-0"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
              )}
              <span className="text-sm font-medium text-foreground truncate">
                {user.fullName || user.username || "User"}
              </span>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0 rounded-md hover:bg-destructive/10"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted w-full"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4" />
                <span>Light mode</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span>Dark mode</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}