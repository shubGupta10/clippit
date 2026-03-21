"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Type, Image as ImageIcon, Link2, Loader2, Sparkles, Plus } from "lucide-react";
import { useApi } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SaveMode = "text" | "image" | "link";

export default function SaveManuallyPage() {
  const [mode, setMode] = useState<SaveMode>("link");
  const [textContent, setTextContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const api = useApi();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let payload: any = { note, type: mode };

      if (mode === "text") {
        if (!textContent.trim()) throw new Error("Text content is required");
        payload = { ...payload, content: textContent, sourceUrl: "Direct Save" };
      } else if (mode === "image") {
        if (!imageUrl.trim()) throw new Error("Image URL is required");
        payload = { ...payload, imageUrl, sourceUrl: imageUrl };
      } else if (mode === "link") {
        if (!linkUrl.trim()) throw new Error("Link URL is required");
        payload = { ...payload, sourceUrl: linkUrl, title: linkTitle };
      }

      await api.post("/api/items/create-item", payload);
      
      toast.success("Item saved successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in duration-700">
      
      {/* Consistent Page Header - Fixed & Breathable */}
      <div className="mb-16 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="flex h-3 w-3 rounded-full bg-primary" />
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tighter">Save Manually</h1>
            <p className="text-sm text-muted-foreground mt-1.5 tracking-tight font-medium max-w-lg">Quickly capture ideas, links, or images directly to your library.</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mt-4 sm:mt-10 lg:mt-16">
        
        {/* Form Content - Unboxed & Spacious */}
        <div className="space-y-16">
          
          {/* Mode Switcher - Styled as a page-level control */}
          <div className="flex bg-muted/30 p-1.5 rounded-full border border-border w-fit min-w-[320px]">
            <button
              onClick={() => setMode("text")}
              className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-6 text-[13px] font-bold rounded-full transition-all duration-300 ${mode === "text" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            >
              <Type className="h-4 w-4" /> Text
            </button>
            <button
              onClick={() => setMode("image")}
              className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-6 text-[13px] font-bold rounded-full transition-all duration-300 ${mode === "image" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            >
              <ImageIcon className="h-4 w-4" /> Image
            </button>
            <button
              onClick={() => setMode("link")}
              className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-6 text-[13px] font-bold rounded-full transition-all duration-300 ${mode === "link" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            >
              <Link2 className="h-4 w-4" /> Link
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-10 group/form">
              {mode === "text" && (
                <div className="space-y-3">
                  <label className="text-[11px] font-black tracking-[0.15em] text-muted-foreground ml-1 uppercase">CONTENT</label>
                  <Textarea
                    value={textContent}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextContent(e.target.value)}
                    placeholder="Paste or type the text you want to save..."
                    className="w-full min-h-[240px] p-6 text-base bg-transparent border border-border/60 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm transition-all resize-none italic leading-relaxed"
                    autoFocus
                  />
                </div>
              )}

              {mode === "image" && (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black tracking-[0.15em] text-muted-foreground ml-1 uppercase">IMAGE URL</label>
                    <Input
                      type="url"
                      value={imageUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.png"
                      className="w-full h-14 px-6 text-base bg-transparent border border-border/60 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm transition-all"
                      autoFocus
                    />
                  </div>
                  {imageUrl && (
                    <div className="relative w-full h-80 rounded-3xl overflow-hidden bg-muted/30 border border-border shadow-2xl transition-all hover:scale-[1.005]">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1pbWFnZS1vZmYiPjxsaW5lIHgxPSIzIiB5MT0iMyIgeDI9IjIxIiB5Mj0iMjEiLz48cGF0aCBkPSJNMTAuNSAxMC41YTEuNSAxLjUgMCAwIDAtMiAyIi8+PHBhdGggZD0iTTEwLjQyIDEwLjQyYTEuNSAxLjUgMCAwIDEgMiAyIi8+PHBhdGggZD0iTTE2IDE2YTMgMyAwIDAgMS02IDBIM2E5IDkgMCAwIDEtMS41LTJIOCIvPjxwYXRoIGQ9Ik0zIDIxYTEgMSAwIDAgMSAxTF8iLz48cGF0aCBkPSJNMjEgM2ExIDEgMCAwIDEgMSAxdjkzIi8+PC9zdmc+'; 
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {mode === "link" && (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black tracking-[0.15em] text-muted-foreground ml-1 uppercase">PAGE TITLE <span className="text-[10px] font-normal opacity-40 italic ml-1">(OPTIONAL)</span></label>
                    <Input
                      type="text"
                      value={linkTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkTitle(e.target.value)}
                      placeholder="Clippit — Save Everything"
                      className="w-full h-14 px-6 text-base bg-transparent border border-border/60 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black tracking-[0.15em] text-muted-foreground ml-1 uppercase">URL</label>
                    <Input
                      type="url"
                      value={linkUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full h-14 px-6 text-base bg-transparent border border-border/60 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm transition-all"
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Note Field - Larger & Unboxed */}
            <div className="pt-8 border-t border-border/40">
              <input
                type="text"
                value={note}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNote(e.target.value)}
                placeholder="Add a thought... (optional)"
                className="w-full h-12 px-2 text-base bg-transparent border-b border-border/60 focus:border-primary focus:outline-none placeholder:text-muted-foreground/30 transition-colors italic"
              />
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-6 pt-6">
              <Button
                type="submit"
                disabled={isLoading || (mode === "text" && !textContent.trim()) || (mode === "image" && !imageUrl.trim()) || (mode === "link" && !linkUrl.trim())}
                className="min-w-[200px] h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Save now</span>
                  </>
                )}
              </Button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all hover:bg-muted/30 rounded-full"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Pro Tip - Unboxed & Muted */}
          <div className="pt-12 border-t border-border/30">
            <div className="flex items-start gap-4 text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-1" />
              <p className="text-[13px] leading-relaxed max-w-lg">
                <span className="text-foreground font-bold">Quick tip:</span> Paste anything to save it instantly. On desktop, check the <span className="text-primary cursor-pointer hover:underline" onClick={() => router.push('/setup')}>Setup page</span> for our 1-click Bookmarklet.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
