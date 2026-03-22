"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { useApi } from "../axios";
import { Item } from "../types";

export function useSearch(onSearch?: (query: string) => void) {
  const api = useApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      if (onSearch) onSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const { data: searchResults = [], isLoading: isSearching } = useSWR(
    debouncedQuery.trim() ? ["/api/search", debouncedQuery] : null,
    async ([url, query]: [string, string]) => {
      const res = await api.post(url, { query });
      return res.data?.data || [];
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  return { searchResults, isSearching, searchQuery, setSearchQuery };
}
