"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MousePointer2, Smartphone, CheckCircle2, ChevronRight, LayoutDashboard, Sparkles } from "lucide-react";
import { useDBUser } from "@/lib/context/UserContext";
import { toast } from "sonner";

export default function OnboardingPage() {
  const { user, completeOnboarding, loading } = useDBUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user?.onboardingComplete) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeOnboarding();
      toast.success("Welcome to Clippit!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const bookmarkletCode = `javascript:(function(){var w=window.open('${appUrl}/bookmarklet?url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent(document.title),'clippitSave','width=400,height=500,left='+(screen.width/2-200)+',top='+(screen.height/2-250)+',resizable=yes,scrollbars=yes');if(!w||w.closed||typeof w.closed==='undefined'){alert('Please allow popups for Clippit in your browser settings');}})()`;
  const escapedBookmarklet = bookmarkletCode.replace(/"/g, '&quot;');

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center animate-in fade-in duration-700">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">Welcome to Clippit</h1>
            <p className="text-muted-foreground text-lg">
              You&apos;re all set to start collecting inspiration.
            </p>
          </div>
          
          <div className="p-6 bg-card border border-border rounded-2xl text-left space-y-4 shadow-sm">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Desktop Optimized</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  On desktop, you can use our bookmarklet to save anything in one click. 
                  On mobile, just use the built-in share sheet!
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]"
          >
            {isCompleting ? "Loading..." : "Go to Dashboard"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 animate-in fade-in duration-700">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Content */}
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary font-bold tracking-wider uppercase text-xs">
              Step {step} of 2
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-foreground leading-[1.1]">
              {step === 1 ? (
                <>Setup your <span className="text-primary italic">Bookmarklet</span></>
              ) : (
                <>You&apos;re ready to <span className="text-primary italic">clipp everything</span></>
              )}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              {step === 1 ? (
                "Save links, images, and text from any website in a single click. No copy-pasting required."
              ) : (
                "Dashboard is ready. Go ahead and start building your library of chaos-free inspiration."
              )}
            </p>
          </div>

          {step === 1 ? (
            <div className="space-y-8">
              <div className="flex flex-col gap-6">
                <div 
                  className="w-fit"
                  dangerouslySetInnerHTML={{
                    __html: `<a href="${escapedBookmarklet}" draggable="true" style="display:inline-flex;align-items:center;justify-content:center;padding:0 32px;height:56px;background-color:var(--primary);color:var(--primary-foreground);border-radius:16px;font-size:16px;font-weight:700;text-decoration:none;cursor:grab;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);white-space:nowrap;transition:all 0.2s;" onmousedown="this.style.cursor='grabbing';this.style.transform='scale(0.98)'" onmouseup="this.style.cursor='grab';this.style.transform='scale(1)'">Save to Clippit</a>`
                  }}
                />
                <div className="flex items-start gap-4 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <MousePointer2 className="w-3.5 h-3.5 text-foreground" />
                  </div>
                  <p className="text-sm">
                    Drag this button to your <span className="text-foreground font-bold">Bookmarks Bar</span>. 
                    <br />
                    <span className="text-xs opacity-60">(Press Ctrl+Shift+B if you don&apos;t see it)</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="group flex items-center gap-2 text-foreground font-bold hover:text-primary transition-colors mt-8"
              >
                I&apos;ve added it, what&apos;s next?
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="w-full sm:w-64 bg-primary text-primary-foreground h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              {isCompleting ? "Loading..." : "Enter Dashboard"}
              <LayoutDashboard className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right: Illustration/Preview */}
        <div className="relative order-first lg:order-last p-8 flex items-center justify-center group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
             
             {step === 1 ? (
                <div className="relative w-full h-full flex flex-col animate-in slide-in-from-bottom-4 duration-700">
                  {/* Browser Window Mockup */}
                  <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col h-full transform transition-transform group-hover:scale-[1.01] duration-500">
                    {/* Toolbar */}
                    <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-4">
                      <div className="flex gap-1.5 opacity-40">
                        <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                        <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                        <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                      </div>
                      <div className="flex-1 h-7 bg-background rounded-lg border border-border flex items-center px-3 gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary/20" />
                        <div className="h-1.5 w-24 bg-muted rounded-full" />
                      </div>
                    </div>
                    
                    {/* Bookmarks Bar */}
                    <div className="bg-card px-4 py-3 border-b border-border flex items-center gap-4">
                      <div className="relative">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 rounded-lg border-2 border-primary/30 border-dashed animate-pulse">
                          <div className="w-2 h-2 bg-primary rounded-sm shrink-0" />
                          <span className="text-[10px] font-extrabold text-primary uppercase tracking-tight">Drop Bookmarklet Here</span>
                        </div>
                        {/* Indicative Arrow (CSS) */}
                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:block">
                           <div className="w-8 h-px bg-primary/40 relative">
                              <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-primary/40" />
                           </div>
                        </div>
                      </div>
                      <div className="h-4 w-12 bg-muted rounded-md opacity-40" />
                      <div className="h-4 w-16 bg-muted rounded-md opacity-40" />
                    </div>

                    {/* Page Content Backdrop */}
                    <div className="flex-1 p-8 space-y-5 bg-background/50">
                      <div className="h-4 w-2/3 bg-muted rounded-full opacity-40" />
                      <div className="h-4 w-full bg-muted rounded-full opacity-25" />
                      <div className="h-4 w-5/6 bg-muted rounded-full opacity-10" />
                      
                      <div className="pt-8 flex flex-col items-center justify-center">
                         <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-40">
                            Browser Window
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
             ) : (
                <div className="text-center space-y-6 animate-in zoom-in-95 duration-700">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground italic">Bookmarklet added!</h3>
                </div>
             )}
          
          {/* Subtle Glows */}
          <div className="absolute -z-10 -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute -z-10 -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
        </div>

      </div>
    </div>
  );
}
