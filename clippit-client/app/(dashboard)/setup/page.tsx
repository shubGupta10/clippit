"use client";

import { useEffect, useState } from "react";
import { Type, Image as ImageIcon, Link2, Smartphone } from "lucide-react";

export default function SetupPage() {
  const [appUrl, setAppUrl] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setAppUrl(window.location.origin);
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const bookmarkletCode = `javascript:(function(){window.open('${appUrl}/bookmarklet?url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent(document.title),'clippitSave','width=400,height=500');})()`;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 relative">
      {/* Header */}
      <div className="mb-8 pl-1 sm:pl-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Get Started with Clippit</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Follow these steps to start saving anything from the web</p>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-10 bottom-10 left-[33px] sm:left-[41px] w-0.5 bg-border/60 z-0 hidden sm:block" />

        {/* Step 1 */}
        <div className="relative z-10 bg-card border border-border rounded-xl p-4 sm:p-6 mb-6 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0 shadow-sm relative z-10">
              1
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Install the bookmarklet</h2>
          </div>

          <div className="mt-4 sm:pl-12">
            {isMobile ? (
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                <Smartphone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The bookmarklet works best on desktop browsers. On mobile, use your browser&apos;s <strong className="text-foreground">share sheet</strong> to save pages directly to Clippit.
                </p>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  Drag the button below to your bookmarks bar. You only need to do this once.
                </p>
                <div className="mb-4">
                  {appUrl && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `<a 
                          href="${bookmarkletCode}" 
                          draggable="true"
                          style="display: inline-flex; align-items: center; gap: 8px; background-color: var(--primary); color: var(--primary-foreground); padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none; cursor: grab; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"
                        >Save to Clippit</a>`
                      }}
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  Tip: In Chrome, press <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px] sm:text-xs font-mono">Ctrl+Shift+B</kbd> to show your bookmarks bar
                </p>
              </>
            )}
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative z-10 bg-card border border-border rounded-xl p-4 sm:p-6 mb-6 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0 shadow-sm relative z-10">
              2
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Save anything you find</h2>
          </div>
          <p className="mt-4 sm:pl-12 text-muted-foreground text-sm leading-relaxed">
            Browse the web normally. When you find something inspiring — an ad, a headline, an image, a page — click the bookmarklet. A small popup appears. Pick what you want to save and hit <strong className="text-foreground font-medium">Save</strong>.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-5 sm:pl-12">
            <span className="bg-muted/80 border border-border text-muted-foreground rounded-full px-3 py-1.5 text-xs sm:text-sm flex items-center gap-2">
              <Type className="w-3.5 h-3.5" />
              Select text
            </span>
            <span className="bg-muted/80 border border-border text-muted-foreground rounded-full px-3 py-1.5 text-xs sm:text-sm flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5" />
              Pick an image
            </span>
            <span className="bg-muted/80 border border-border text-muted-foreground rounded-full px-3 py-1.5 text-xs sm:text-sm flex items-center gap-2">
              <Link2 className="w-3.5 h-3.5" />
              Save whole page
            </span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative z-10 bg-primary/5 border border-primary/20 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0 shadow-sm relative z-10">
              3
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Search in plain English</h2>
          </div>
          <p className="mt-4 sm:pl-12 text-muted-foreground text-sm leading-relaxed">
            Go to your dashboard and type what you&apos;re looking for. No tags needed. Just describe it — <span className="text-foreground font-medium italic">&quot;blue minimalist landing pages&quot;</span> or <span className="text-foreground font-medium italic">&quot;emotional fitness ads&quot;</span> — and Clippit finds the most relevant things you saved.
          </p>
        </div>
      </div>
    </div>
  );
}