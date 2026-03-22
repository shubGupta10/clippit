"use client";

import React, { createContext, useContext } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useApi } from "@/lib/axios";
import { User } from "@/lib/types";
import { useSWRAuth } from "@/lib/hooks/useSWRAuth";

interface UserContextType {
  user: User | null;
  loading: boolean;
  clerkUser: any;
  isLoaded: boolean;
  refreshUser: () => void;
  completeOnboarding: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const api = useApi();

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

  return (
    <UserContext.Provider value={{ 
      user: user || null, 
      loading, 
      clerkUser, 
      isLoaded, 
      refreshUser, 
      completeOnboarding 
    }}>
      {children}
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
