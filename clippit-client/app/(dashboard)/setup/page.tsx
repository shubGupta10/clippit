"use client";

import { Type, Image as ImageIcon, Link2 } from "lucide-react";

export default function SetupPage() {
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const bookmarkletCode = `javascript:(function(){window.open('${appUrl}/bookmarklet?url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent(document.title),'clippitSave','width=400,height=500');})()`;

  return (
    <div className="max-w-2xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Get Started with Clippit</h1>
        <p className="text-muted-foreground mt-2 text-base">Follow these steps to start saving anything from the web</p>
      </div>

      {/* Step 1 */}
      <div className="bg-card border border-border rounded-lg p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
            1
          </div>
          <h2 className="text-lg font-semibold text-foreground">Install the bookmarklet</h2>
        </div>
        <p className="mt-3 text-muted-foreground text-sm">
          Drag the button below to your bookmarks bar. You only need to do this once.
        </p>
        <div className="mt-4">
          <div
            dangerouslySetInnerHTML={{
              __html: `<a 
                href="${bookmarkletCode}" 
                draggable="true"
                style="display: inline-flex; align-items: center; gap: 8px; background-color: var(--primary); color: var(--primary-foreground); padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500; text-decoration: none; cursor: grab;"
              >Save to Clippit</a>`
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Tip: In Chrome, press <kbd className="px-1 py-0.5 bg-muted rounded border border-border text-xs font-mono">Ctrl+Shift+B</kbd> to show your bookmarks bar
        </p>
      </div>

      {/* Step 2 */}
      <div className="bg-card border border-border rounded-lg p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
            2
          </div>
          <h2 className="text-lg font-semibold text-foreground">Save anything you find</h2>
        </div>
        <p className="mt-3 text-muted-foreground text-sm">
          Browse the web normally. When you find something inspiring — an ad, a headline, an image, a page — click the bookmarklet. A small popup appears. Pick what you want to save and hit Save.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm flex items-center gap-1">
            <Type className="w-3.5 h-3.5" />
            Select text → save it
          </span>
          <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" />
            Pick an image → save it
          </span>
          <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5" />
            Save the whole page → save it
          </span>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-card border border-border rounded-lg p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
            3
          </div>
          <h2 className="text-lg font-semibold text-foreground">Search in plain English</h2>
        </div>
        <p className="mt-3 text-muted-foreground text-sm">
          Go to your dashboard and type what you&apos;re looking for. No tags needed. Just describe it — &quot;blue minimalist landing pages&quot; or &quot;emotional fitness ads&quot; — and Clippit finds the most relevant things you saved.
        </p>
      </div>
    </div>
  );
}
