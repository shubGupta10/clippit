"use client";

import React, { createContext, useContext, useState } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useApi } from "@/lib/axios";
import { User } from "@/lib/types";
import { useSWRAuth } from "@/lib/hooks/useSWRAuth";
import { UpgradeModal } from "@/components/layout/UpgradeModal";

export type UpgradeReason = 'saves' | 'collections' | 'sharedCollections' | 'export';

interface UserContextType {
  user: User | null;
  loading: boolean;
  clerkUser: any;
  isLoaded: boolean;
  refreshUser: () => void;
  completeOnboarding: () => Promise<void>;
  // Upgrade Modal state
  isUpgradeModalOpen: boolean;
  upgradeReason: UpgradeReason | null;
  openUpgradeModal: (reason: UpgradeReason) => void;
  closeUpgradeModal: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const api = useApi();

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<UpgradeReason | null>(null);

  const { data: user, isLoading: loading, mutate: refreshUser } = useSWRAuth<User>(
    isLoaded && clerkUser ? "/api/user/get-me" : null
  );

  const completeOnboarding = async () => {
    try {
      const response = await api.put("/api/user/complete-onboarding");
      refreshUser(response.data);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      throw error;
    }
  };

  const openUpgradeModal = (reason: UpgradeReason) => {
    setUpgradeReason(reason);
    setIsUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
    setUpgradeReason(null);
  };

  return (
    <UserContext.Provider value={{ 
      user: user || null, 
      loading, 
      clerkUser, 
      isLoaded, 
      refreshUser, 
      completeOnboarding,
      isUpgradeModalOpen,
      upgradeReason,
      openUpgradeModal,
      closeUpgradeModal
    }}>
      {children}
      <UpgradeModal />
    </UserContext.Provider>
  );
}

export function useDBUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useDBUser must be used within a UserProvider");
  }
  return context;
}
