"use client";

import { useEffect, useState } from "react";
import { Type, Image as ImageIcon, Link2, Smartphone } from "lucide-react";

export default function SetupPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    setMounted(true);
  }, []);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const bookmarkletCode = `javascript:(function(){var w=window.open('${appUrl}/bookmarklet?url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent(document.title),'clippitSave','width=400,height=500,left='+(screen.width/2-200)+',top='+(screen.height/2-250)+',resizable=yes,scrollbars=yes');if(!w||w.closed||typeof w.closed==='undefined'){alert('Please allow popups for Clippit in your browser settings');}})()`;

  return (
    <div className="p-4 sm:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto py-8">

        {/* Step 1 */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-lg font-bold shrink-0">
              1
            </div>
            <h2 className="text-2xl font-bold text-foreground">Install the bookmarklet</h2>
          </div>

          <div className="sm:pl-14">
            <p className="text-muted-foreground text-lg mb-8">
              Drag the button below to your bookmarks bar. You only need to do this once.
            </p>

            <div className="mb-8">
              {!mounted ? null : isMobile ? (
                <div className="flex items-start gap-4 p-5 bg-muted/20 rounded-xl border border-border/50 max-w-md">
                  <Smartphone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The bookmarklet is for desktop. On mobile, use the <strong className="text-foreground">share sheet</strong>.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* dangerouslySetInnerHTML bypasses React's javascript: URL block */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `
                        href="${bookmarkletCode}"
                        draggable="true"
                        style="
                          display: inline-flex;
                          align-items: center;
                          justify-content: center;
                          padding: 0 24px;
                          height: 48px;
                          background-color: var(--primary);
                          color: var(--primary-foreground);
                          border-radius: 8px;
                          font-size: 15px;
                          font-weight: 500;
                          text-decoration: none;
                          cursor: grab;
                          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                          white-space: nowrap;
                          transition: opacity 0.15s;
                        "
                        onmousedown="this.style.cursor='grabbing'"
                        onmouseup="this.style.cursor='grab'"
                      >Save to Clippit</a>`
                    }}
                  />

                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span>Tip: In Chrome, press</span>
                    <kbd className="px-2 py-1 bg-muted rounded border border-border text-xs font-mono text-foreground">
                      Ctrl+Shift+B
                    </kbd>
                    <span>to show your bookmarks bar, then allow popups when prompted</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-lg font-bold shrink-0">
              2
            </div>
            <h2 className="text-2xl font-bold text-foreground">Save anything you find</h2>
          </div>
          <div className="sm:pl-14">
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Browse the web normally. When you find something inspiring — an ad, a headline, an image, a page — click the bookmarklet. A small popup appears. Pick what you want to save and hit Save.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Type, label: "Select text" },
                { icon: ImageIcon, label: "Pick an image" },
                { icon: Link2, label: "Save whole page" }
              ].map((item, i) => (
                <span key={i} className="bg-muted/30 border border-border/50 text-foreground/80 rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2.5 shadow-sm">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-lg font-bold shrink-0">
              3
            </div>
            <h2 className="text-2xl font-bold text-foreground">Search in plain English</h2>
          </div>
          <div className="sm:pl-14">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Go to your dashboard and type what you&apos;re looking for. No tags needed. Just describe it — <span className="text-foreground font-bold italic">&quot;blue minimalist landing pages&quot;</span> or <span className="text-foreground font-bold italic">&quot;emotional fitness ads&quot;</span> — and Clippit finds the most relevant things you saved.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}