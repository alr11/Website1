import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <p className="font-serif text-5xl font-semibold text-blush-400">404</p>
        <h1 className="font-serif text-2xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          That page isn&apos;t part of the planner.
        </p>
        <Button asChild>
          <Link href="/">Back to the dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
