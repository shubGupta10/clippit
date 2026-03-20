"use client";

import { Item } from "@/lib/types";
import { Trash2, ExternalLink, MoreHorizontal, FolderHeart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddToCollectionModal } from "@/components/collections/AddToCollectionModal";
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
  hideCollectionBadge?: boolean;
}

export function ItemCard({ item, onDelete, isDeleting, hideCollectionBadge }: ItemCardProps) {
  const [imgError, setImgError] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`relative flex flex-col h-full bg-card rounded-xl overflow-hidden group cursor-pointer transition-all duration-200 ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Collection Badge */}
        {item.collectionId && !hideCollectionBadge && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <span className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-primary bg-card border border-border rounded-full">
              <FolderHeart className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[120px]">{item.collectionId.name}</span>
            </span>
          </div>
        )}

        {/* Image */}
        {item.type === "image" && item.imageUrl && !imgError && (
          <div className="w-full overflow-hidden bg-muted">
            <img
              src={item.imageUrl}
              alt={item.title || "Saved image"}
              className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">

          {/* Text Cards */}
          {item.type === "text" && (
            <p className="text-foreground text-[14px] line-clamp-5 leading-relaxed">
              {item.content || "No text content available"}
            </p>
          )}

          {/* Link Cards */}
          {item.type === "link" && (
            <div className="flex flex-col gap-1.5 flex-1">
              <h4 className="font-semibold text-foreground text-[15px] leading-snug line-clamp-3">
                {item.title || domain || "Saved Link"}
              </h4>
              {domain && (
                <p className="text-muted-foreground text-[12px] truncate mt-auto">
                  {domain}
                </p>
              )}
            </div>
          )}

          {/* Image fallback title */}
          {item.type === "image" && imgError && item.title && (
            <h4 className="font-semibold text-foreground text-[15px] leading-tight line-clamp-2">
              {item.title}
            </h4>
          )}

          {/* Image title below image */}
          {item.type === "image" && !imgError && item.title && (
            <h4 className="font-semibold text-foreground text-[15px] leading-snug line-clamp-2 mt-1">
              {item.title}
            </h4>
          )}

          {/* Note on image cards */}
          {item.type === "image" && item.note && (
            <p className="text-muted-foreground text-[13px] line-clamp-2 mt-2 italic">
              {item.note}
            </p>
          )}


        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-[12px] text-muted-foreground bg-card group-hover:bg-muted/5 transition-colors">
          <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
            <span className="truncate font-medium">{domain || "clippit"}</span>
            <span className="shrink-0">·</span>
            <span className="shrink-0">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Action buttons — fade in on hover */}
            <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
            {item.sourceUrl && (
              <button
                onClick={handleExternalLink}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                title="Open source"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={handleDeleteClick}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted rounded-md transition-colors"
              disabled={isDeleting}
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            {!item.collectionId && mounted && (
              <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors outline-none"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-48 z-50">
                    <DropdownMenuItem onClick={() => setShowCollectionModal(true)} className="gap-2 cursor-pointer text-[13px]">
                      <FolderHeart className="h-4 w-4 text-muted-foreground" />
                      <span>Add to collection</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            </div>

            {faviconUrl && (
              <img src={faviconUrl} alt="" className="w-3.5 h-3.5 rounded-sm shrink-0" />
            )}
          </div>
        </div>
      </div>

      <AddToCollectionModal
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        itemId={item._id}
        currentCollectionId={item.collectionId?._id}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the saved item. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
