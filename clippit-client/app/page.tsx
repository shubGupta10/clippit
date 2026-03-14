import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <h1 className="text-4xl font-bold tracking-tight">Clippit</h1>
      <Link 
        href="/sign-in"
        className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity"
      >
        Sign in
      </Link>
    </main>
  );
}
