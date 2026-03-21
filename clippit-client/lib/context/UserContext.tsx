"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useApi } from "@/lib/axios";
import { User } from "@/lib/types";

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const api = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!clerkUser) return;
    try {
      const response = await api.get("/api/user/get-me");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching DB user:", error);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      const response = await api.put("/api/user/complete-onboarding");
      setUser(response.data);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (clerkUser) {
        fetchUser();
      } else {
        setLoading(false);
      }
    }
  }, [isLoaded, clerkUser]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser, completeOnboarding }}>
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
