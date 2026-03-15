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

  const [editingNote, setEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  const [editingTags, setEditingTags] = useState(false);
  const [tagsValue, setTagsValue] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSavingTags, setIsSavingTags] = useState(false);

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

  const handleSaveNote = async () => {
    setIsSavingNote(true);
    try {
      await patch({ note: noteValue, tags: item?.tags });
      setItem((prev) => prev ? { ...prev, note: noteValue } : prev);
      setEditingNote(false);
    } catch {
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleSaveTags = async () => {
    setIsSavingTags(true);
    try {
      await patch({ note: item?.note, tags: tagsValue });
      setItem((prev) => prev ? { ...prev, tags: tagsValue } : prev);
      setEditingTags(false);
    } catch {
    } finally {
      setIsSavingTags(false);
    }
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
      <div className="max-w-2xl mx-auto p-8 text-center">
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
      <div className="max-w-2xl mx-auto p-4 sm:p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {/* Image */}
          {item.type === "image" && item.imageUrl && !imgError && (
            <div className="w-full bg-muted border-b border-border">
              <img
                src={item.imageUrl}
                alt={item.title || "Saved image"}
                className="w-full h-auto max-h-[500px] object-contain"
                onError={() => setImgError(true)}
              />
            </div>
          )}

          <div className="p-5 sm:p-6">
            {/* Type badge + title */}
            <div className="flex items-start gap-3 mb-4">
              <span className="shrink-0 mt-0.5 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-secondary text-secondary-foreground">
                {item.type}
              </span>
              {item.title && (
                <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                  {item.title}
                </h1>
              )}
            </div>

            {/* Text content */}
            {item.type === "text" && item.content && (
              <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap mb-5">
                {item.content}
              </p>
            )}

            {/* Divider */}
            <div className="border-t border-border my-5" />

            {/* Note section */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Note</span>
                {!editingNote ? (
                  <button
                    onClick={() => setEditingNote(true)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={handleSaveNote}
                      disabled={isSavingNote}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 px-2 py-1 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      <Check className="w-3 h-3" /> {isSavingNote ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => { setNoteValue(item.note || ""); setEditingNote(false); }}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                )}
              </div>
              {editingNote ? (
                <textarea
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full text-sm text-foreground bg-muted/50 border border-border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed min-h-[2rem]">
                  {item.note || <span className="italic text-muted-foreground/60">No note added</span>}
                </p>
              )}
            </div>

            {/* Tags section */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</span>
                </div>
                {!editingTags ? (
                  <button
                    onClick={() => setEditingTags(true)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={handleSaveTags}
                      disabled={isSavingTags}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 px-2 py-1 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      <Check className="w-3 h-3" /> {isSavingTags ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => { setTagsValue(item.tags || []); setEditingTags(false); }}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {(editingTags ? tagsValue : item.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs"
                  >
                    {tag}
                    {editingTags && (
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}

                {editingTags && (
                  <div className="flex items-center gap-1">
                    <input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="Add tag..."
                      className="text-xs bg-muted/50 border border-border rounded-full px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary w-24"
                    />
                    <button
                      onClick={addTag}
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {!editingTags && (item.tags || []).length === 0 && (
                  <span className="text-xs text-muted-foreground/60 italic">No tags</span>
                )}
              </div>
            </div>

            {/* Footer meta */}
            <div className="border-t border-border pt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
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
