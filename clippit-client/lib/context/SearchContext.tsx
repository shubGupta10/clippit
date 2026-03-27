"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { useApi } from "../axios";
import { Item } from "../types";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Item[];
  isSearching: boolean;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const api = useApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults = [], isValidating, isLoading } = useSWR(
    debouncedQuery.trim() ? ["/api/search", debouncedQuery] : null,
    async ([url, query]: [string, string]) => {
      const res = await api.post(url, { query });
      return res.data?.data || [];
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      keepPreviousData: false,
    }
  );

  // Consider it searching only if there is an active query
  const isSearching = searchQuery.trim().length > 0 && 
                      (isLoading || isValidating || searchQuery !== debouncedQuery);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedQuery("");
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}
