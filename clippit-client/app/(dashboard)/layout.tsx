"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { SearchProvider } from "@/lib/context/SearchContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SearchProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Mobile overlay */}
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 ml-0 lg:ml-64 flex flex-col min-w-0 overflow-hidden relative bg-muted/20">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto h-full relative">
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}

