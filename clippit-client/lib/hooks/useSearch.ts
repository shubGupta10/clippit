"use client";

import { useState, useEffect } from "react";
import { useApi } from "../axios";
import { Item } from "../types";

export function useSearch(onSearch?: (query: string) => void) {
  const api = useApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // If empty query, reset instantly
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      if (onSearch) onSearch("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      if (onSearch) onSearch(searchQuery);

      try {
        const response = await api.post("/api/search", { query: searchQuery });
        const items = response.data?.items || response.data || [];
        setSearchResults(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, api, onSearch]);

  return { searchResults, isSearching, searchQuery, setSearchQuery };
}
