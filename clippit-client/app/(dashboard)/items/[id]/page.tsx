"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Item } from "@/lib/types";
import { ArrowLeft, ExternalLink, Tag, Calendar, Globe } from "lucide-react";
import Link from "next/link";

export default function ItemOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/items/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const body = await res.json();
          setItem(body.data ?? body);
        }
      } catch (err) {
        console.error("Failed to load item", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Item not found</h2>
        <p className="text-muted-foreground text-sm mb-6">This item may have been deleted.</p>
        <Link href="/dashboard" className="text-primary hover:underline text-sm">← Back to dashboard</Link>
      </div>
    );
  }

  const domain = item.sourceUrl ? (() => { try { return new URL(item.sourceUrl).hostname; } catch { return item.sourceUrl; } })() : "";
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : "";
  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
    : "Unknown date";

  return (
    <div className="max-w-2xl mx-auto p-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Image */}
        {item.type === "image" && item.imageUrl && !imgError && (
          <div className="w-full bg-muted">
            <img
              src={item.imageUrl}
              alt={item.title || "Saved image"}
              className="w-full h-auto max-h-[500px] object-contain"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        <div className="p-6">
          {/* Type badge */}
          <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-secondary text-secondary-foreground mb-4">
            {item.type}
          </span>

          {/* Title */}
          {item.title && (
            <h1 className="text-2xl font-bold text-foreground leading-tight mb-3">
              {item.title}
            </h1>
          )}

          {/* Text content */}
          {item.type === "text" && item.content && (
            <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
              {item.content}
            </p>
          )}

          {/* Note */}
          {item.note && (
            <div className="mt-4 p-4 bg-muted rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground italic">{item.note}</p>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              <Tag className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer meta */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-5 border-t border-border text-xs text-muted-foreground">
            {domain && (
              <span className="flex items-center gap-1.5">
                {faviconUrl && <img src={faviconUrl} alt="" className="w-3.5 h-3.5 rounded-sm" />}
                <Globe className="w-3.5 h-3.5" />
                {domain}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline ml-auto"
              >
                Open source <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
