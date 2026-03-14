"use client";

import { useState } from "react";
import { Item } from "@/lib/types";
import { ItemCard } from "./ItemCard";
import { EmptyState } from "./EmptyState";
import { useItems } from "@/lib/hooks/useItems";
import { useSearch } from "@/lib/hooks/useSearch";
import { Navbar } from "../layout/Navbar";

export function ItemGrid({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems || []);
  const { deleteItem, isDeleting } = useItems();
  const { searchResults, isSearching, searchQuery, setSearchQuery } = useSearch();

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    setItems((prev) => prev.filter((item) => item._id !== id));
    const success = await deleteItem(id);
    if (!success) {
      // Revert optimization (optional fallback logic could go here)
    }
  };

  const displayItems = searchQuery.trim() ? searchResults : items;
  const showEmpty = !isSearching && displayItems.length === 0;

  return (
    <>
      <Navbar onSearch={(q) => setSearchQuery(q)} />
      <div className="p-6 max-w-[1600px] mx-auto w-full">
        {showEmpty ? (
          <EmptyState />
        ) : (
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
        
        {isSearching && (
          <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-5 py-2.5 rounded-full shadow-lg text-sm font-medium animate-pulse flex items-center gap-2 z-50">
            <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin shrink-0"></span>
            Searching...
          </div>
        )}
      </div>
    </>
  );
}
