"use client";

import { useSWRAuth } from "./useSWRAuth";
import { UsageLimits } from "../types";
import { useDBUser, UpgradeReason } from "../context/UserContext";

export function usePlanLimits() {
  const { data, isLoading, error, mutate } = useSWRAuth<UsageLimits>(
    "/api/user/usage-limits"
  );
  
  const { openUpgradeModal } = useDBUser();

  const checkLimit = (type: 'saves' | 'collections' | 'sharedCollections'): boolean => {
    if (isLoading || !data) return true; // Fail safe

    const usage = data.usage;
    const limits = data.limits;

    if (type === 'saves') {
      if (usage.saves >= limits.maxSaves) {
        openUpgradeModal('saves');
        return false;
      }
    } else if (type === 'collections') {
      if (usage.collections >= limits.maxCollections) {
        openUpgradeModal('collections');
        return false;
      }
    } else if (type === 'sharedCollections') {
      if (usage.sharedCollections >= limits.maxSharedCollections) {
        openUpgradeModal('sharedCollections');
        return false;
      }
    }

    return true;
  };

  return {
    usageData: data,
    isLoading,
    error,
    refreshUsage: mutate,
    checkLimit,
    isSavesLimitReached: data ? data.usage.saves >= data.limits.maxSaves : false,
    isCollectionsLimitReached: data ? data.usage.collections >= data.limits.maxCollections : false,
  };
}
