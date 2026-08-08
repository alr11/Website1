"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shared loading / error wrapper for the list views so every page fails the
 * same way instead of rendering an empty table.
 */
export function QueryState({
  isPending,
  isError,
  error,
  onRetry,
  skeletonRows = 5,
  children,
}: {
  isPending: boolean;
  isError: boolean;
  error?: unknown;
  onRetry: () => void;
  skeletonRows?: number;
  children: React.ReactNode;
}) {
  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: skeletonRows }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
        <AlertCircle className="h-7 w-7 text-destructive" />
        <p className="text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Something went wrong loading this list."}
        </p>
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw />
          Try again
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
