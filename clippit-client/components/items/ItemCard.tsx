"use client";

import { Item } from "@/lib/types";
import { Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function ItemCard({ item, onDelete, isDeleting }: ItemCardProps) {
  const [imgError, setImgError] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(item._id);
    setShowDeleteDialog(false);
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.sourceUrl) window.open(item.sourceUrl, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = () => {
    router.push(`/items/${item._id}`);
  };

  const domain = item.sourceUrl ? (() => { try { return new URL(item.sourceUrl).hostname; } catch { return ""; } })() : "";
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : "";

  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Just now";

  const renderBadge = () => {
    const label = item.type === "text" ? "Text" : item.type === "image" ? "Image" : "Link";
    return (
      <span className="absolute top-4 right-4 px-2.5 py-0.5 text-xs font-medium rounded-full bg-accent text-accent-foreground shadow-sm z-10 pointer-events-none">
        {label}
      </span>
    );
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`relative flex flex-col h-full bg-card border border-border rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Magic hover glow effect - visible only on hover */}
        <div className="absolute inset-x-0 -top-px h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {renderBadge()}

        {/* Content Area */}
        <div className="flex flex-col flex-1 relative z-10">
          {item.type === "image" && item.imageUrl && !imgError && (
            <div className="w-full relative overflow-hidden bg-muted rounded-t-xl group-hover:rounded-t-none transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <img
                src={item.imageUrl}
                alt={item.title || "Saved image"}
                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
                loading="lazy"
              />
              
              {/* Glassmorphism Title Overlay for Images */}
              {(item.title) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <h4 className="font-semibold text-white text-sm sm:text-base leading-tight line-clamp-2 tracking-tight drop-shadow-md">
                    {item.title}
                  </h4>
                </div>
              )}
            </div>
          )}

          <div className={`p-5 flex flex-col flex-1 ${item.type === 'text' ? 'bg-muted/10' : item.type === 'link' ? 'bg-primary/[0.02]' : ''}`}>
            
            {/* Text Cards */}
            {item.type === "text" && (
              <div className="relative">
                <div className="absolute -top-2 -left-2 text-2xl text-muted-foreground/20 font-serif leading-none">&ldquo;</div>
                <p className="text-foreground/90 text-[15px] line-clamp-5 leading-relaxed tracking-tight relative z-10 pt-2 pb-1">
                  {item.content || "No text content available"}
                </p>
              </div>
            )}

            {/* Link Cards */}
            {item.type === "link" && (
              <div className="pr-12 pt-1 flex flex-col h-full">
                <h4 className="font-semibold text-foreground text-[17px] leading-snug mb-2.5 line-clamp-3 tracking-tight group-hover:text-primary transition-colors">
                  {item.title || domain || "Saved Link"}
                </h4>
                <p className="text-muted-foreground/80 text-[13px] truncate max-w-full flex items-center gap-1.5 mt-auto bg-muted/30 px-2 py-1.5 rounded-md w-fit border border-border/50">
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.sourceUrl}</span>
                </p>
              </div>
            )}

            {/* Image Text Fallback (if image fails or has notes) */}
            {(item.type === "image" || imgError) && item.title && imgError && (
              <h4 className="font-semibold text-foreground text-base leading-tight mb-2 line-clamp-2 tracking-tight">
                {item.title}
              </h4>
            )}

            {(item.type === "image" || imgError) && item.note && (
              <p className="text-muted-foreground/80 text-sm line-clamp-3 mt-3 italic border-l-2 border-primary/30 pl-3">
                {item.note}
              </p>
            )}

            {/* Tags area */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-auto pt-5">
                {item.tags.map((tag) => (
                  <span key={tag} className="bg-secondary/80 text-secondary-foreground text-[11px] font-medium tracking-wide rounded-full px-2.5 py-1 hover:bg-secondary transition-colors border border-border/40">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-border/50 flex items-center justify-between bg-card text-[13px] text-muted-foreground relative z-20">
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            {faviconUrl ? (
              <img src={faviconUrl} alt="" className="w-4 h-4 rounded-[3px] shrink-0 opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
            ) : (
              <div className="w-4 h-4 rounded-[3px] shrink-0 bg-muted flex items-center justify-center">
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
            )}
            <span className="font-medium truncate group-hover:text-foreground transition-colors tracking-tight" title={domain}>
              {domain || "clippit"}
            </span>
            <span className="w-1 h-1 rounded-full bg-border shrink-0 mx-0.5" />
            <span className="shrink-0 tracking-tight">{formattedDate}</span>
          </div>

          {/* Action buttons — invisible by default, fade in on hover */}
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-20 shrink-0">
            {item.sourceUrl && (
              <button
                onClick={handleExternalLink}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors active:scale-95"
                title="Open source"
                aria-label="Open source URL"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={handleDeleteClick}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors active:scale-95"
              disabled={isDeleting}
              title="Delete item"
              aria-label="Delete item"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the saved item from Clippit. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
