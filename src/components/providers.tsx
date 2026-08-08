"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/sonner";

export interface SessionUser {
  id: string;
  email: string;
}

const UserContext = React.createContext<SessionUser | null>(null);

/** The signed-in user. Throws if used outside the authenticated layout. */
export function useUser() {
  const user = React.useContext(UserContext);
  if (!user) {
    throw new Error("useUser must be used inside <Providers>");
  }
  return user;
}

export function Providers({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
      <Toaster />
    </QueryClientProvider>
  );
}
