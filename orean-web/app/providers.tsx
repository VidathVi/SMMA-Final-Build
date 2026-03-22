"use client";

import React from "react";
import { SocialMediaProvider } from "../contexts/SocialMediaContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SocialMediaProvider>
      {children}
    </SocialMediaProvider>
  );
}
