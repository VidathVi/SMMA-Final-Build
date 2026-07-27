"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type SocialConnectionType = {
  id: number;
  platform: string;
  platformUsername: string;
  profileUrl: string;
  connectedAt: string;
};

interface SocialMediaContextProps {
  connections: SocialConnectionType[];
  loading: boolean;
  refreshConnections: () => Promise<void>;
}

const SocialMediaContext = createContext<SocialMediaContextProps | undefined>(
  undefined,
);

export const SocialMediaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connections, setConnections] = useState<SocialConnectionType[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshConnections = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("orean360_token") || localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/auth/social-connections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConnections(data.connections || []);
      }
    } catch (e) {
      console.error("Failed to fetch social connections", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshConnections();
  }, []);

  return (
    <SocialMediaContext.Provider
      value={{ connections, loading, refreshConnections }}
    >
      {children}
    </SocialMediaContext.Provider>
  );
};

export const useSocialMedia = () => {
  const ctx = useContext(SocialMediaContext);
  if (!ctx)
    throw new Error("useSocialMedia must be used within SocialMediaProvider");
  return ctx;
};
