"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useApi } from "@/lib/axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sun, Moon, Monitor, Settings2, UserCircle2, ShieldAlert } from "lucide-react";

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
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      setShowClearDialog(false);
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
      setIsDeletingAccount(false);
    }
  };

  if (!mounted || !user) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
          <Settings2 className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">Manage your account and app preferences</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Main Settings Column */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Section: Profile */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-widest mb-8 flex items-center gap-2">
              <UserCircle2 className="w-4 h-4 text-primary" />
              Profile Details
            </h2>

            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col items-center sm:items-start gap-4 shrink-0">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile picture"
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-muted"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-muted ring-4 ring-muted flex items-center justify-center text-muted-foreground">
                    <UserCircle2 className="w-10 h-10" />
                  </div>
                )}
                <div className="px-2 py-1 bg-muted rounded-md border border-border">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground text-center">
                    Identity by Clerk
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                      Display Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        readOnly
                        value={user.fullName || user.username || ""}
                        className="bg-muted border border-border rounded-xl px-4 py-2.5 text-sm w-full cursor-not-allowed text-foreground/70 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={user.primaryEmailAddress?.emailAddress || ""}
                      className="bg-muted border border-border rounded-xl px-4 py-2.5 text-sm w-full cursor-not-allowed text-foreground/70 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: App Preferences */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-widest mb-8 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary" />
              Application
            </h2>

            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-md">
                  <h3 className="text-[15px] font-semibold text-foreground mb-1">Default Tab</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Which tab should open by default when saving new items.
                  </p>
                </div>

                <div className="flex items-center gap-1 p-1 bg-muted rounded-xl border border-border w-fit shrink-0">
                  {(["text", "image", "link"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleModeChange(mode)}
                      className={`px-4 py-1.5 text-[13px] rounded-lg transition-all capitalize font-medium ${
                        defaultMode === mode
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-card"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border w-full" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-md">
                  <h3 className="text-[15px] font-semibold text-foreground mb-1">Color Theme</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Switch between light and dark modes or follow your system.
                  </p>
                </div>

                <div className="flex items-center gap-1 p-1 bg-muted rounded-xl border border-border w-fit shrink-0">
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
                        className={`flex items-center gap-2 px-4 py-1.5 text-[13px] rounded-lg transition-all font-medium ${
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-card"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Danger Column */}
        <div className="xl:col-span-4">
          <section className="bg-card rounded-2xl border border-destructive/30 p-6 sm:p-8 sticky top-24">
            <h2 className="text-sm font-bold text-destructive uppercase tracking-widest mb-8 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Danger Zone
            </h2>

            <div className="space-y-10">
              <div className="space-y-4">
                <div>
                  <h3 className="text-[14px] font-bold text-foreground mb-1">Clear Data</h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    Permanently delete all saved items. This action cannot be reversed.
                  </p>
                </div>
                
                <button 
                  onClick={() => setShowClearDialog(true)}
                  className="w-full bg-destructive text-destructive-foreground hover:bg-destructive px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all active:scale-[0.98]"
                >
                  Clear All Items
                </button>

                <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                  <AlertDialogContent className="rounded-2xl border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-bold">Clear all items?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground text-sm">
                        All your saved images, links, and text will be deleted forever.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl border-border">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleClearItems} 
                        disabled={isDeletingItems} 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive rounded-xl font-bold"
                      >
                        {isDeletingItems ? "Clearing..." : "Yes, clear all"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="h-px w-full bg-border" />

              <div className="space-y-4">
                <div>
                  <h3 className="text-[14px] font-bold text-foreground mb-1">Delete Account</h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    Close your Clippit account. All your data will be wiped immediately.
                  </p>
                </div>
                
                <button 
                    onClick={() => setShowDeleteDialog(true)}
                    className="w-full border border-destructive text-destructive hover:bg-destructive/5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all active:scale-[0.98]"
                >
                    Delete Account Forever
                </button>

                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogContent className="rounded-2xl border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-bold text-destructive">Delete your account?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground text-sm">
                        This is permanent. Your identity and all saved clips will be purged.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl border-border">Keep Account</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount} 
                        disabled={isDeletingAccount} 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive rounded-xl font-bold"
                      >
                        {isDeletingAccount ? "Deleting..." : "Delete Account"}
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
