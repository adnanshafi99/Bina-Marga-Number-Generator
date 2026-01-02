"use client";

import { SessionProvider } from "next-auth/react";
import { TranslationProvider } from "@/lib/i18n/context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </SessionProvider>
  );
}


