"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { SetupCard } from "@/components/workspace/setup-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeddingSettings } from "@/lib/hooks/use-wedding";

/**
 * Every authenticated page sits behind this gate: it waits for the wedding
 * settings row, shows first-run setup when there isn't one, and surfaces a
 * retry when Supabase is unreachable.
 */
export function WorkspaceGate({ children }: { children: React.ReactNode }) {
  const { data, isPending, isError, error, refetch, isFetching } =
    useWeddingSettings();

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <div className="space-y-1">
          <h2 className="font-serif text-xl font-semibold">
            We couldn&apos;t reach your data
          </h2>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Check your Supabase URL and anon key, then try again."}
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={isFetching ? "animate-spin" : undefined} />
          Try again
        </Button>
      </div>
    );
  }

  if (!data) {
    return <SetupCard />;
  }

  return <>{children}</>;
}
