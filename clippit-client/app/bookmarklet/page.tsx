"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Bookmark, Type, Image as ImageIcon, Link2, X, Check, Loader2 } from "lucide-react";

type SaveMode = "text" | "image" | "link";

function BookmarkletForm() {
  const searchParams = useSearchParams();
  const { getToken, isLoaded: isAuthLoaded, userId } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  const initialUrl = searchParams.get("url") || "";
  const initialTitle = searchParams.get("title") || "";
  const initialText = searchParams.get("text") || "";

  const [mode, setMode] = useState<SaveMode>(initialText ? "text" : "link");

  const [textContent, setTextContent] = useState(initialText);
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState(initialUrl);
  const [linkTitle, setLinkTitle] = useState(initialTitle);
  const [note, setNote] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthLoaded || !isUserLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userId) {
    const handleSignIn = () => {
      window.open(
        `${window.location.origin}/sign-in`,
        "_blank",
        "noopener,noreferrer"
      );
    };

    return (
      <div className="flex flex-col h-full w-full items-center justify-center p-8 text-center gap-4">
        <div className="bg-muted p-4 rounded-full">
          <X className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Session expired</h2>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          Sign in to Clippit in your browser, then click the bookmarklet again.
        </p>
        <button
          onClick={handleSignIn}
          className="mt-1 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95"
        >
          Sign in to Clippit
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication failed");

      let payload: any = { note, type: mode };

      if (mode === "text") {
        if (!textContent.trim()) throw new Error("Text content is required");
        payload = { ...payload, content: textContent, sourceUrl: initialUrl || "Direct Save" };
      } else if (mode === "image") {
        if (!imageUrl.trim()) throw new Error("Image URL is required");
        payload = { ...payload, imageUrl, sourceUrl: initialUrl || imageUrl };
      } else if (mode === "link") {
        if (!linkUrl.trim()) throw new Error("Link URL is required");
        payload = { ...payload, sourceUrl: linkUrl, title: linkTitle };
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/items/create-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to save item");
      }

      setIsSuccess(true);
      setTimeout(() => {
        window.close();
      }, 1500);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col h-[400px] w-full items-center justify-center p-8 text-center gap-4 animate-in fade-in zoom-in-50 duration-500">
        <div className="bg-green-500/10 p-5 rounded-full animate-in zoom-in spin-in-12 duration-500">
          <Check className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Saved!</h2>
        <p className="text-sm text-muted-foreground">You can close this window.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-[400px] bg-background mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Bookmark className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Save to Clippit</h1>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-muted/60 p-1.5 rounded-full mb-6 shrink-0 border border-border">
        <button
          onClick={() => setMode("text")}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${mode === "text" ? "bg-primary text-primary-foreground shadow-sm scale-[0.98]" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
        >
          <Type className="h-4 w-4" /> Text
        </button>
        <button
          onClick={() => setMode("image")}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${mode === "image" ? "bg-primary text-primary-foreground shadow-sm scale-[0.98]" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
        >
          <ImageIcon className="h-4 w-4" /> Image
        </button>
        <button
          onClick={() => setMode("link")}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${mode === "link" ? "bg-primary text-primary-foreground shadow-sm scale-[0.98]" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
        >
          <Link2 className="h-4 w-4" /> Link
        </button>
      </div>

      {/* Content Forms */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
        {mode === "text" && (
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Paste or type the text you want to save..."
            className="w-full flex-1 min-h-[120px] p-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring resize-none placeholder:text-muted-foreground shadow-sm transition-all"
          />
        )}

        {mode === "image" && (
          <div className="flex flex-col gap-3">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL..."
              className="w-full p-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring placeholder:text-muted-foreground shadow-sm transition-all"
            />
            {imageUrl && (
              <div className="relative w-full h-32 rounded-xl overflow-hidden bg-muted border border-border mt-2 shadow-sm">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1pbWFnZS1vZmYiPjxsaW5lIHgxPSIzIiB5MT0iMyIgeDI9IjIxIiB5Mj0iMjEiLz48cGF0aCBkPSJNMTAuNSAxMC41YTEuNSAxLjUgMCAwIDAtMiAyIi8+PHBhdGggZD0iTTEwLjQyIDEwLjQyYTEuNSAxLjUgMCAwIDEgMiAyIi8+PHBhdGggZD0iTTE2IDE2YTMgMyAwIDAgMS02IDBIM2E5IDkgMCAwIDEtMS41LTJIOCIvPjxwYXRoIGQ9Ik0zIDIxYTEgMSAwIDAgMSAxTF8iLz48cGF0aCBkPSJNMjEgM2ExIDEgMCAwIDEgMSAxdjkzIi8+PC9zdmc+'; // simple broken image icon
                  }}
                />
              </div>
            )}
          </div>
        )}

        {mode === "link" && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground ml-1">Title</label>
              <input
                type="text"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="Page title"
                className="w-full p-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring shadow-sm transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground ml-1">URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://"
                className="w-full p-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring shadow-sm transition-all"
              />
            </div>
          </div>
        )}

        {/* Note Field */}
        <div className="mt-auto pt-2 mb-4">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)..."
            className="w-full p-2.5 text-sm bg-transparent border-b border-border focus:border-primary focus:outline-none placeholder:text-muted-foreground transition-colors"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 mt-2">
        {error && (
          <div className="mb-3 text-xs text-destructive-foreground bg-destructive/10 p-2.5 rounded-lg border border-destructive/20 break-words">
            {error}
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={isLoading || (mode === "text" && !textContent.trim()) || (mode === "image" && !imageUrl.trim()) || (mode === "link" && !linkUrl.trim())}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function BookmarkletPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-5 overflow-hidden flex flex-col items-center">
      <Suspense fallback={
        <div className="flex h-[400px] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <BookmarkletForm />
      </Suspense>
    </main>
  );
}
