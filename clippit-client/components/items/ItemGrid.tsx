"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import { Item, GroupedItem } from "@/lib/types";
import { ItemCard } from "./ItemCard";
import { EmptyState } from "./EmptyState";
import { useItems } from "@/lib/hooks/useItems";
import { useSearchContext } from "@/lib/context/SearchContext";
import { SearchX, RotateCw, X, Columns2, LayoutGrid } from "lucide-react";

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse break-inside-avoid mb-4 sm:mb-6 inline-block w-full">
      <div className="bg-muted h-36 w-full" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
      <div className="px-3 sm:px-4 py-3 border-t border-border/40 flex items-center gap-2">
        <div className="h-3 w-3 bg-muted rounded-full" />
        <div className="h-3 bg-muted rounded w-24" />
      </div>
    </div>
  );
}

export function ItemGrid({ initialItems }: { initialItems: GroupedItem[] }) {
  const { data: items = [], mutate, isValidating } = useItems().useUserItems(initialItems);
  const { deleteItem, isDeleting } = useItems();
  const { searchResults, isSearching, searchQuery, clearSearch } = useSearchContext();

  const [viewMode, setViewMode] = useState<"vertical" | "horizontal">("vertical");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("dashboardViewMode");
    if (saved === "horizontal" || saved === "vertical") {
      setViewMode(saved);
    }
  }, []);

  const handleToggleView = (mode: "vertical" | "horizontal") => {
    setViewMode(mode);
    localStorage.setItem("dashboardViewMode", mode);
  };

  const handleRefresh = useCallback(() => {
    mutate();
  }, [mutate]);

  const handleDelete = async (id: string) => {
    await mutate(
      (prevItems) => {
        if (!prevItems) return [];
        return prevItems
          .map(group => ({
            ...group,
            items: group.items.filter(item => item._id !== id)
          }))
          .filter(group => group.items.length > 0);
      },
      { revalidate: false }
    );

    try {
      await deleteItem(id);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      mutate();
    }
  };

  const totalItemsCount = useMemo(() => {
    return items.reduce((acc, group) => acc + group.items.length, 0);
  }, [items]);

  const isSearchActive = searchQuery.trim().length > 0;

  const gridContainerClass = viewMode === "vertical" 
    ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 sm:gap-6" 
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 items-start";

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
        {/* Page header row */}
        <div className="mb-4 sm:mb-5 flex items-center justify-between">
          {isSearchActive && !isSearching ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {searchResults.length > 0
                  ? <><span className="font-medium text-foreground">{searchResults.length}</span> result{searchResults.length !== 1 ? "s" : ""} for <span className="font-medium text-foreground">&ldquo;{searchQuery}&rdquo;</span></>
                  : <>No results for <span className="font-medium text-foreground">&ldquo;{searchQuery}&rdquo;</span></>
                }
              </p>
              <button
                onClick={clearSearch}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all duration-200 active:scale-95"
              >
                <X className="w-3.5 h-3.5" /> Clear Search
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary/80" />
              <p className="text-sm font-medium text-muted-foreground tracking-tight">
                {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} saved
              </p>
            </div>
          )}

          {!isSearchActive && (
            <div className="flex items-center gap-3">
              {/* Vertical/Horizontal Flow Toggle */}
              <div className="flex items-center bg-muted p-1 rounded-lg border border-border">
                <button
                  onClick={() => handleToggleView("vertical")}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all text-sm font-medium ${viewMode === "vertical" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  title="Flow Vertically (Masonry Columns)"
                >
                  <Columns2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Vertical</span>
                </button>
                <button
                  onClick={() => handleToggleView("horizontal")}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all text-sm font-medium ${viewMode === "horizontal" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  title="Flow Horizontally (Grid Rows)"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Horizontal</span>
                </button>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isValidating}
                title="Refresh"
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all px-3 py-2 rounded-lg hover:bg-muted disabled:opacity-50 min-h-[40px] active:scale-95"
              >
                <RotateCw className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">{isValidating ? "Refreshing..." : "Refresh"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Search skeleton */}
        {isSearching && (
          <div className={gridContainerClass}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty: no search results */}
        {!isSearching && isSearchActive && searchResults.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 w-full max-w-md mx-auto">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <SearchX className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">No results found</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nothing matched &ldquo;{searchQuery}&rdquo;. Try different keywords or a broader description.
            </p>
          </div>
        )}

        {/* Empty: no items */}
        {!isSearching && !isSearchActive && totalItemsCount === 0 && <EmptyState />}

        {/* Results grid (Search - Flat) */}
        {!isSearching && isSearchActive && searchResults.length > 0 && (
          <div className={gridContainerClass}>
            {searchResults.map((item, i) => (
              <div
                key={item._id}
                className={`${viewMode === "vertical" ? "break-inside-avoid inline-block mb-5 sm:mb-6" : ""} w-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`}
                style={{ animationDelay: `${Math.min(i * 30, 400)}ms` }}
              >
                <ItemCard
                  item={item}
                  onDelete={handleDelete}
                  isDeleting={isDeleting === item._id}
                />
              </div>
            ))}
          </div>
        )}

        {/* Results grid (Main Feed - Grouped) */}
        {!isSearching && !isSearchActive && items.length > 0 && (
          <div className="space-y-10">
            {items.map((group) => (
              <div key={group.label}>
                <h3 className="text-lg font-semibold mb-5 text-foreground/90 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary/20 rounded-full" />
                  {group.label}
                </h3>
                <div className={gridContainerClass}>
                  {group.items.map((item, i) => (
                    <div
                      key={item._id}
                      className={`${viewMode === "vertical" ? "break-inside-avoid inline-block mb-5 sm:mb-6" : ""} w-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`}
                      style={{ animationDelay: `${Math.min(i * 30, 400)}ms` }}
                    >
                      <ItemCard
                        item={item}
                        onDelete={handleDelete}
                        isDeleting={isDeleting === item._id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
