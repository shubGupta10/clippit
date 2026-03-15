"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Item } from "@/lib/types";
import {
  ArrowLeft, ExternalLink, Tag, Calendar, Globe,
  Trash2, Pencil, Check, X, Plus
} from "lucide-react";
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

export default function ItemOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const router = useRouter();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [noteValue, setNoteValue] = useState("");
  const [tagsValue, setTagsValue] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/items/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const body = await res.json();
          const data = body.data ?? body;
          setItem(data);
          setNoteValue(data.note || "");
          setTagsValue(data.tags || []);
        }
      } catch (err) {
        console.error("Failed to load item", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, getToken]);

  const patch = async (payload: { note?: string; tags?: string[] }) => {
    const token = await getToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/items/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await patch({ note: noteValue, tags: tagsValue });
      setItem((prev) => prev ? { ...prev, note: noteValue, tags: tagsValue } : prev);
      setIsEditing(false);
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNoteValue(item?.note || "");
    setTagsValue(item?.tags || []);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/dashboard");
    } catch {
      setIsDeleting(false);
    }
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tagsValue.includes(trimmed)) {
      setTagsValue((prev) => [...prev, trimmed]);
    }
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setTagsValue((prev) => prev.filter((t) => t !== tag));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full text-center mt-12">
        <h2 className="text-xl font-semibold text-foreground mb-2">Item not found</h2>
        <p className="text-muted-foreground text-sm mb-6">This item may have been deleted.</p>
        <button onClick={() => router.push("/dashboard")} className="text-primary hover:underline text-sm">
          ← Back to dashboard
        </button>
      </div>
    );
  }

  const domain = item.sourceUrl ? (() => { try { return new URL(item.sourceUrl).hostname; } catch { return item.sourceUrl; } })() : "";
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : "";
  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
    : "Unknown date";

  return (
    <>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted border border-border rounded-lg transition-all active:scale-95 shadow-sm"
              >
                <Pencil className="w-4 h-4" />
                Edit Item
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all active:scale-95"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all active:scale-95 shadow-sm disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
            
            <button
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-all active:scale-95 border border-transparent hover:border-destructive/20 ml-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Main Content Area (No box!) */}
        <div className="flex flex-col gap-8">
          
          {/* Header Section (Title & Type) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="shrink-0 px-2.5 py-1 text-[11px] uppercase font-bold tracking-wider rounded-md bg-secondary text-secondary-foreground inline-block">
                {item.type}
              </span>
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 opacity-70" /> {formattedDate}
              </span>
            </div>
            
            {item.title && (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight mt-2">
                {item.title}
              </h1>
            )}
            
            {/* Domain / Source Link below title */}
            {domain && (
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                  {faviconUrl ? (
                    <img src={faviconUrl} alt="" className="w-4 h-4 rounded-[3px]" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                  {domain}
                </span>
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    Visit original <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-border w-full opacity-60 my-2" />

          {/* Core Content (Image or Text) */}
          {item.type === "image" && item.imageUrl && !imgError && (
            <div className="w-full relative rounded-2xl overflow-hidden border border-border bg-muted/30 shadow-sm max-w-4xl">
              <img
                src={item.imageUrl}
                alt={item.title || "Saved image"}
                className="w-full h-auto object-contain"
                onError={() => setImgError(true)}
              />
            </div>
          )}

          {item.type === "text" && item.content && (
            <div className="relative max-w-4xl">
              <div className="absolute -top-4 -left-6 text-6xl text-muted-foreground/10 font-serif leading-none select-none hidden sm:block">
                &ldquo;
              </div>
              <p className="text-foreground/90 text-lg sm:text-xl leading-relaxed whitespace-pre-wrap font-medium">
                {item.content}
              </p>
            </div>
          )}

          {/* Notes & Tags Area - Two Column Layout on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl bg-muted/20 border border-border rounded-2xl p-6 sm:p-8 mt-4">
            
            {/* Note section */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Personal Note
                </span>
              </div>
              
              {isEditing ? (
                <textarea
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  placeholder="Add a note to remember why you saved this..."
                  rows={4}
                  className="w-full text-base text-foreground bg-background border border-border rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                />
              ) : (
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  {item.note || <span className="italic text-muted-foreground/50">No note added. Edit item to add context.</span>}
                </p>
              )}
            </div>

            {/* Tags section */}
            <div>
              <div className="flex items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-foreground/50" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-widest">Collections</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {(isEditing ? tagsValue : item.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground font-medium rounded-full px-4 py-1.5 text-sm shadow-sm border border-transparent hover:border-border transition-colors"
                  >
                    <Tag className="w-3.5 h-3.5 opacity-70" />
                     {tag}
                    {isEditing && (
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 -mr-1 p-0.5 hover:bg-secondary-foreground/10 rounded-full text-secondary-foreground/70 hover:text-destructive transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </span>
                ))}

                {isEditing && (
                  <div className="flex items-center gap-2">
                    <input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="Add tag..."
                      className="text-sm bg-background border border-border rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 w-32 shadow-sm transition-all"
                    />
                    <button
                      onClick={addTag}
                      className="p-1.5 text-primary hover:text-primary-foreground hover:bg-primary rounded-full transition-colors border border-primary/20 bg-primary/10"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {!isEditing && (item.tags || []).length === 0 && (
                  <span className="text-[15px] text-muted-foreground/50 italic">No tags associated.</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
