"use client";

import React from "react";
import { Check, Sparkles, X, Zap } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDBUser, UpgradeReason } from "@/lib/context/UserContext";
import { useRouter } from "next/navigation";

export function UpgradeModal() {
  const { isUpgradeModalOpen, upgradeReason, closeUpgradeModal } = useDBUser();
  const router = useRouter();

  const getReasonInfo = (reason: UpgradeReason | null) => {
    switch (reason) {
      case 'saves':
        return {
          title: "Saves Limit Reached",
          description: "You've captured so much! To keep saving more, upgrade to Pro.",
          icon: <Zap className="w-6 h-6 text-amber-500" />
        };
      case 'collections':
        return {
          title: "Collections Limit Reached",
          description: "You've reached the limit for personal collections. Upgrade to Pro for unlimited organization.",
          icon: <Zap className="w-6 h-6 text-amber-500" />
        };
      case 'sharedCollections':
        return {
          title: "Collaboration Limit Reached",
          description: "Free users can only join a few shared collections. Go Pro to collaborate with everyone.",
          icon: <Zap className="w-6 h-6 text-amber-500" />
        };
      case 'export':
        return {
          title: "Premium Export Formats",
          description: "Exporting to CSV and Markdown is a Pro feature. Level up your productivity.",
          icon: <Sparkles className="w-6 h-6 text-primary" />
        };
      default:
        return {
          title: "Get Clippit Pro",
          description: "Unlock the full power of your personal inspiration library.",
          icon: <Zap className="w-6 h-6 text-amber-500" />
        };
    }
  };

  const { title, description, icon } = getReasonInfo(upgradeReason);

  const handleUpgrade = () => {
    closeUpgradeModal();
    router.push("/settings"); // Assuming settings page has payment/upgrade options
  };

  const proFeatures = [
    "Unlimited Saves",
    "Unlimited Collections",
    "Advanced Export (CSV, Markdown)",
    "Priority Search indexing",
    "Early access to new features"
  ];

  return (
    <Dialog open={isUpgradeModalOpen} onOpenChange={(open) => !open && closeUpgradeModal()}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 gap-0 border-none shadow-2xl">
        {/* Decorative Top Section */}
        <div className="bg-gradient-to-br from-primary/20 via-background to-background pt-10 pb-6 px-6 relative">
          <div className="absolute top-4 right-4">
             <DialogClose className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
             </DialogClose>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-background rounded-2xl shadow-xl border border-border/50 animate-in zoom-in-50 duration-500">
              {icon}
            </div>
            <div className="space-y-1.5">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">{title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground max-w-[280px]">
                {description}
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-6 py-6 space-y-5 bg-background">
          <div className="grid gap-3">
            {proFeatures.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="p-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium text-foreground/80">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Button 
              onClick={handleUpgrade}
              className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90 shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] transition-all font-semibold rounded-xl group"
            >
              <span>Upgrade to Pro</span>
              <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
            </Button>
            <p className="text-center text-[10px] text-muted-foreground mt-4 uppercase tracking-widest font-semibold opacity-60">
              Join 1,000+ happy curators
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
