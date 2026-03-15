"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useApi } from "@/lib/axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sun, Moon, Monitor } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();
  const api = useApi();

  const [mounted, setMounted] = useState(false);
  const [defaultMode, setDefaultMode] = useState<"text" | "image" | "link">("link");
  const [isDeletingItems, setIsDeletingItems] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem("clippit_default_save_mode") as "text" | "image" | "link";
    if (savedMode && ["text", "image", "link"].includes(savedMode)) {
      setDefaultMode(savedMode);
    }
  }, []);

  const handleModeChange = (mode: "text" | "image" | "link") => {
    setDefaultMode(mode);
    localStorage.setItem("clippit_default_save_mode", mode);
  };

  const handleClearItems = async () => {
    setIsDeletingItems(true);
    try {
      await api.delete("/api/items/clear-all-items");
      toast.success("All items deleted");
      // Optional: force a refresh of the page or router to clear any cached items elsewhere
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete items");
      console.error(error);
    } finally {
      setIsDeletingItems(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await api.delete("/api/items/delete-account");
      toast.success("Account deleted");
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      toast.error("Failed to delete account");
      console.error(error);
      setIsDeletingAccount(false); // Only reset if failed. If success, we are redirecting away.
    }
  };

  if (!mounted || !user) return null; // Avoid hydration mismatch on themes/localStorage

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Account & Preferences */}
        <div className="xl:col-span-7 space-y-8">
          
          {/* Section 1: Profile */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Profile
            </h2>

            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col items-center sm:items-start gap-4 shrink-0">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile picture"
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-muted shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-muted ring-4 ring-muted shadow-md flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground text-center sm:text-left max-w-[100px]">
                  Managed by Clerk
                </p>
              </div>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 ml-1">
                      Display Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        readOnly
                        value={user.fullName || user.username || ""}
                        className="bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm w-full cursor-not-allowed opacity-80 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={user.primaryEmailAddress?.emailAddress || ""}
                      className="bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm w-full cursor-not-allowed opacity-80 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Preferences */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              App Preferences
            </h2>

            <div className="space-y-10">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Default Save Mode</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Choose which tab opens by default when you use the bookmarklet.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 p-1 bg-muted/30 rounded-2xl border border-border/50 w-fit">
                  {(["text", "image", "link"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleModeChange(mode)}
                      className={`px-5 py-2 text-sm rounded-xl transition-all active:scale-95 capitalize font-medium ${
                        defaultMode === mode
                          ? "bg-foreground text-background shadow-lg"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Color Theme</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Personalize your interface appearance.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: "light", label: "Light", icon: Sun },
                    { id: "dark", label: "Dark", icon: Moon },
                    { id: "system", label: "System", icon: Monitor },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex items-center gap-2.5 px-5 py-2.5 text-sm rounded-xl transition-all active:scale-95 font-medium border ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-card text-muted-foreground hover:text-foreground hover:border-border border-transparent"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Danger Zone */}
        <div className="xl:col-span-5">
          <section className="bg-destructive/[0.02] border border-destructive/20 rounded-2xl p-6 sm:p-8 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold text-destructive mb-8 flex items-center gap-2">
              <span className="w-1 h-6 bg-destructive rounded-full" />
              Danger Zone
            </h2>

            <div className="space-y-8">
              {/* Clear Items */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground">Clear Everything</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Permanently delete all your saved items. This action is irreversible.
                  </p>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] shadow-lg shadow-destructive/10 border border-white/10">
                    Delete All Data
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This will permanently delete all your saved snippets, images, and links. You cannot undo this.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                      <AlertDialogCancel className="rounded-xl border-border bg-muted/30">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleClearItems} 
                        disabled={isDeletingItems} 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold"
                      >
                        {isDeletingItems ? "Working..." : "Confirm Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="h-px w-full bg-border/50" />

              {/* Delete Account */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground">Close Account</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Everything will be wiped and your account will be closed permanently.
                  </p>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] shadow-lg shadow-destructive/10 border border-white/10">
                    Delete My Account
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-bold">Final Goodbye?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This will permanently delete your account and all associated data. You will be signed out immediately.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                      <AlertDialogCancel className="rounded-xl border-border bg-muted/30">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount} 
                        disabled={isDeletingAccount} 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold"
                      >
                        {isDeletingAccount ? "Processing..." : "Delete Forever"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
