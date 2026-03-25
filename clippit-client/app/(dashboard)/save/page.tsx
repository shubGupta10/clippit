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
    <div className="p-4 sm:p-8 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
      
      {/* Consistent Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Save Manually</h1>
          <p className="text-sm text-muted-foreground mt-1">Quickly capture ideas, links, or images directly to your library.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="space-y-8">
          
          {/* Mode Switcher */}
          <div className="flex bg-muted p-1 rounded-lg w-fit border border-border">
            <button
              onClick={() => setMode("text")}
              className={`flex items-center gap-2 py-1.5 px-4 text-sm font-medium rounded-md transition-all ${mode === "text" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Type className="h-4 w-4" /> Text
            </button>
            <button
              onClick={() => setMode("image")}
              className={`flex items-center gap-2 py-1.5 px-4 text-sm font-medium rounded-md transition-all ${mode === "image" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ImageIcon className="h-4 w-4" /> Image
            </button>
            <button
              onClick={() => setMode("link")}
              className={`flex items-center gap-2 py-1.5 px-4 text-sm font-medium rounded-md transition-all ${mode === "link" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Link2 className="h-4 w-4" /> Link
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-300">
            <div className="space-y-6">
              {mode === "text" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Content</label>
                  <Textarea
                    value={textContent}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextContent(e.target.value)}
                    placeholder="Paste or type the text you want to save..."
                    className="w-full min-h-[150px] p-3 text-sm bg-background border border-border rounded-lg focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary focus:outline-none shadow-sm transition-all resize-none"
                    autoFocus
                  />
                </div>
              )}

              {mode === "image" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Image URL</label>
                    <Input
                      type="url"
                      value={imageUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.png"
                      className="w-full h-10 px-3 text-sm bg-background border border-border rounded-lg focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary focus:outline-none shadow-sm transition-all"
                      autoFocus
                    />
                  </div>
                  {imageUrl && (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden bg-muted border border-border shadow-sm">
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
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Page Title <span className="text-xs font-normal text-muted-foreground ml-1">(Optional)</span></label>
                    <Input
                      type="text"
                      value={linkTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkTitle(e.target.value)}
                      placeholder="Clippit — Save Everything"
                      className="w-full h-10 px-3 text-sm bg-background border border-border rounded-lg focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary focus:outline-none shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">URL</label>
                    <Input
                      type="url"
                      value={linkUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full h-10 px-3 text-sm bg-background border border-border rounded-lg focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary focus:outline-none shadow-sm transition-all"
                      autoFocus
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Note <span className="text-xs font-normal text-muted-foreground ml-1">(Optional)</span></label>
                <Input
                  type="text"
                  value={note}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNote(e.target.value)}
                  placeholder="Add a thought..."
                  className="w-full h-10 px-3 text-sm bg-background border border-border rounded-lg focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary focus:outline-none shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading || (mode === "text" && !textContent.trim()) || (mode === "image" && !imageUrl.trim()) || (mode === "link" && !linkUrl.trim())}
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-5 py-2 rounded-lg font-medium text-sm transition-all shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Save Item</span>
                  </>
                )}
              </Button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:bg-muted rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Pro Tip */}
          <div className="pt-6 border-t border-border">
            <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg border border-border/50">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Quick tip:</span> Paste anything to save it instantly. On desktop, check the <button type="button" className="text-primary hover:underline font-medium" onClick={() => router.push('/setup')}>Setup page</button> for our 1-click Bookmarklet.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
