import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accentClassName = "bg-accent text-primary",
  children,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accentClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <Card className="hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 truncate font-serif text-3xl font-semibold">
              {value}
            </p>
          </div>
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              accentClassName,
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {children ? <div className="mt-4">{children}</div> : null}
        {hint ? (
          <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
