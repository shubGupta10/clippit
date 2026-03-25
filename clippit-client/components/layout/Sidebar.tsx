"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Bookmark,
  LayoutDashboard,
  Settings2,
  Sun,
  Moon,
  LogOut,
  X,
  FolderHeart,
  ChevronRight,
  Wrench,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    onClose?.();
  }, [pathname]);

  const mainNav: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
    { href: "/save", label: "Save Manually", icon: <Plus className="h-[18px] w-[18px]" /> },
    { href: "/collections", label: "Collections", icon: <FolderHeart className="h-[18px] w-[18px]" /> },
  ];

  const settingsNav: NavItem[] = [
    { href: "/setup", label: "Setup", icon: <Wrench className="h-[18px] w-[18px]" /> },
    { href: "/settings", label: "Settings", icon: <Settings2 className="h-[18px] w-[18px]" /> },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        className={`group relative flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-out overflow-hidden ${
          active
            ? "bg-muted text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        <span className={`transition-all duration-300 ease-out ${active ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"}`}>
          {item.icon}
        </span>
        <span className="flex-1">{item.label}</span>
        {active && (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </Link>
    );
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 w-64 bg-background border-r border-border flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        lg:translate-x-0 lg:shadow-none
      `}
    >
      {/* Logo */}
      <div className="px-5 flex items-center justify-between h-14 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="bg-muted rounded-lg p-1.5">
            <Bookmark className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">Clippit</span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-3 pt-4 flex-1 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <p className="px-3 mb-1 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Main
          </p>
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <p className="px-3 mb-1 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Configure
          </p>
          {settingsNav.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer: user + theme */}
      <div className="px-3 py-3 border-t border-border flex flex-col gap-2 shrink-0">
        {user && (
          <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-muted transition-colors group">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="User avatar"
                  className="h-7 w-7 rounded-full bg-muted object-cover shrink-0"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-muted shrink-0" />
              )}
              <span className="text-sm font-medium text-foreground truncate">
                {user.fullName || user.username || "User"}
              </span>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors shrink-0 rounded-md hover:bg-muted opacity-0 group-hover:opacity-100"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="lg:hidden flex items-center justify-between px-2 py-2 rounded-lg bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors"
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
            <div className="w-7 h-3.5 rounded-full bg-border relative">
              <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-foreground transition-all ${theme === 'dark' ? 'left-[14px]' : 'left-0.5'}`} />
            </div>
          </button>
        )}
      </div>
    </aside>
  );
}