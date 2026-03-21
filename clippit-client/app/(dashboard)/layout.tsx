"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { SearchProvider } from "@/lib/context/SearchContext";
import { useDBUser } from "@/lib/context/UserContext";
import { useRouter, usePathname } from "next/navigation";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user: dbUser, loading: dbLoading, clerkUser, isLoaded: isClerkLoaded } = useDBUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isClerkLoaded && clerkUser) {
      if (!dbLoading) {
        console.log("Onboarding Redirection Check:", {
          hasDbUser: !!dbUser,
          onboardingComplete: dbUser?.onboardingComplete,
          pathname
        });

        if (!dbUser || !dbUser.onboardingComplete) {
          if (pathname !== "/onboarding") {
            console.log("Redirecting to /onboarding...");
            router.push("/onboarding");
          }
        }
      }
    }
  }, [dbUser, dbLoading, isClerkLoaded, clerkUser, pathname, router]);

  if (pathname === "/onboarding") {
    return <>{children}</>;
  }

  if (dbLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
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
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchProvider>
      <DashboardContent>{children}</DashboardContent>
    </SearchProvider>
  );
}

