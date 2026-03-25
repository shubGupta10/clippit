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

  const isMetadataOnboarded = clerkUser?.publicMetadata?.onboardingComplete === true;
  const isCurrentlyOnboarding = pathname === "/onboarding";

  useEffect(() => {
    if (isClerkLoaded && clerkUser) {
      if (!dbLoading) {
        const isActuallyOnboarded = dbUser?.onboardingComplete === true;

        // If the DB says they aren't onboarded, they must go to /onboarding
        if (!isActuallyOnboarded && !isCurrentlyOnboarding) {
          router.push("/onboarding");
        }
      }
    }
  }, [dbUser, dbLoading, isClerkLoaded, clerkUser, pathname, router, isCurrentlyOnboarding]);

  if (isCurrentlyOnboarding) {
    return <>{children}</>;
  }

  // OPTIMIZATION: Only show full-screen spinner if we DON'T have a high-confidence "onboarded" signal from Clerk
  // This allows the dashboard to render instantly for returning users.
  if (dbLoading && !isMetadataOnboarded) {
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

      <div className="flex-1 ml-0 lg:ml-64 flex flex-col min-w-0 overflow-hidden relative bg-background">
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


