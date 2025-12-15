"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
