import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-w-0 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto h-full relative">
          {children}
        </main>
      </div>
    </div>
  );
}
