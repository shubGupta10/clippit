"use client";

import { useState } from "react";
import { useApi } from "../axios";
import { useSWRAuth } from "./useSWRAuth";
import { GroupedItem } from "../types";

export function useItems() {
  const api = useApi();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const useUserItems = (initialData?: GroupedItem[]) => {
    return useSWRAuth<GroupedItem[]>("/api/items/get-user-items", {
      fallbackData: initialData,
    });
  };

  const deleteItem = async (id: string) => {
    setIsDeleting(id);
    try {
      await api.delete(`/api/items/${id}`);
      return true;
    } catch (error) {
      console.error("Failed to delete item:", error);
      return false;
    } finally {
      setIsDeleting(null);
    }
  };

  return { deleteItem, isDeleting, useUserItems };
}
