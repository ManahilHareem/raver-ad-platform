"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiFetch } from "@/lib/api";

interface User {
  id: string;
  email: string;
  fullName: string;
  professionalRole: string;
  bio: string;
  avatarUrl: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  campaignUpdates: boolean;
  aiInsights: boolean;
  teamActivity: boolean;
  weeklySummary: boolean;
  createdAt: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const response = await apiFetch(`${API_BASE}/users/me`);
      if (response.ok) {
        const result = await response.json();
        setUser(result.data);
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.message || "Unauthorized");
      }
    } catch (err: any) {
      console.error("User context fetch failure:", err);
      setError(err?.message || "Failed to fetch user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, error, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
