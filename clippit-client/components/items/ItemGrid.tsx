"use client";

import { useCallback, useState } from "react";
import { Item } from "@/lib/types";
import { ItemCard } from "./ItemCard";
import { EmptyState } from "./EmptyState";
import { useItems } from "@/lib/hooks/useItems";
import { useSearch } from "@/lib/hooks/useSearch";
import { Navbar } from "../layout/Navbar";
import { SearchX, RotateCw } from "lucide-react";
import { useApi } from "@/lib/axios";


function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse break-inside-avoid mb-6 inline-block w-full">
      <div className="bg-muted h-40 w-full" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
      <div className="px-4 py-3 border-t border-border/40 flex items-center gap-2">
        <div className="h-3 w-3 bg-muted rounded-full" />
        <div className="h-3 bg-muted rounded w-24" />
      </div>
    </div>
  );
}

export function ItemGrid({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems || []);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { deleteItem, isDeleting } = useItems();
  const { searchResults, isSearching, searchQuery, setSearchQuery } = useSearch();
  const api = useApi();

  const handleRefresh = useCallback(
    async () => {
      setIsRefreshing(true);
      try {
        const res = await api.get("/api/items/get-user-items");
        const fresh = res.data?.data;
        if (Array.isArray(fresh)) {
          setItems(fresh)
        }
      } catch (error) {
        console.error("Refresh failed")
      } finally {
        setIsRefreshing(false);
      }
    },
    [api]
  )

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
    await deleteItem(id);
  };

  const isSearchActive = searchQuery.trim().length > 0;
  const displayItems = isSearchActive ? searchResults : items;

  return (
    <>
      <Navbar
        onSearch={(q) => setSearchQuery(q)}
        resultCount={isSearchActive && !isSearching ? searchResults.length : undefined}
        isSearching={isSearching}
      />

      <div className="p-6 max-w-[1600px] mx-auto w-full">
        {/* Page header with refresh button */}
        <div className="mb-5 flex items-center justify-between">
          {isSearchActive && !isSearching ? (
            <p className="text-sm text-muted-foreground">
              {searchResults.length > 0
                ? <>Showing <span className="font-medium text-foreground">{searchResults.length}</span> result{searchResults.length !== 1 ? "s" : ""} for <span className="font-medium text-foreground">&ldquo;{searchQuery}&rdquo;</span></>
                : <>No results for <span className="font-medium text-foreground">&ldquo;{searchQuery}&rdquo;</span></>
              }
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          )}

          {!isSearchActive && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted disabled:opacity-50"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          )}
        </div>

        {/* Skeleton loading */}
        {isSearching && (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty states */}
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

        {!isSearching && !isSearchActive && items.length === 0 && <EmptyState />}

        {/* Results grid */}
        {!isSearching && displayItems.length > 0 && (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {displayItems.map((item) => (
              <div key={item._id} className="break-inside-avoid mb-6 inline-block w-full">
                <ItemCard
                  item={item}
                  onDelete={handleDelete}
                  isDeleting={isDeleting === item._id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
