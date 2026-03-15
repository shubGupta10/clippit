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
      <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-secondary text-secondary-foreground shadow-sm z-10 pointer-events-none">
        {label}
      </span>
    );
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`relative bg-card border border-border rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group cursor-pointer ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
      >
        {renderBadge()}

        {/* Image */}
        {item.type === "image" && item.imageUrl && !imgError && (
          <div className="w-full overflow-hidden bg-muted">
            <img
              src={item.imageUrl}
              alt={item.title || "Saved image"}
              className="w-full h-auto max-h-[400px] object-cover"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          </div>
        )}

        <div className="p-3 sm:p-4 pt-4 sm:pt-5">
          {item.type === "text" && (
            <p className="text-foreground text-sm line-clamp-4 leading-relaxed whitespace-pre-wrap">
              {item.content || "No text content available"}
            </p>
          )}

          {item.type === "link" && (
            <div className="pr-10">
              <h4 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1.5 line-clamp-2">
                {item.title || domain || "Saved Link"}
              </h4>
              <p className="text-muted-foreground text-xs truncate max-w-full">{item.sourceUrl}</p>
            </div>
          )}

          {(item.type === "image" || imgError) && item.title && (
            <h4 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1.5 line-clamp-2 mt-2">
              {item.title}
            </h4>
          )}

          {(item.type === "image" || imgError) && item.note && (
            <p className="text-muted-foreground text-sm line-clamp-3 mt-1">{item.note}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-4 py-3 border-t border-border/40 flex items-center justify-between bg-muted/10">
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            {faviconUrl && <img src={faviconUrl} alt="" className="w-3.5 h-3.5 rounded-sm shrink-0" />}
            <span className="text-[11px] font-medium text-muted-foreground truncate" title={domain}>
              {domain}
            </span>
            <span className="w-1 h-1 rounded-full bg-border shrink-0" />
            <span className="text-[11px] text-muted-foreground shrink-0 hidden sm:inline">{formattedDate}</span>
          </div>

          {/* Action buttons — large touch targets */}
          <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity z-20 shrink-0">
            {item.sourceUrl && (
              <button
                onClick={handleExternalLink}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                title="Open source"
                aria-label="Open source URL"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={handleDeleteClick}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
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
