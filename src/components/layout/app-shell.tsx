"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LogOut, Menu } from "lucide-react";

import { Nav } from "@/components/layout/nav";
import { useUser } from "@/components/providers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { WorkspaceGate } from "@/components/workspace/workspace-gate";
import { useWeddingSettings } from "@/lib/hooks/use-wedding";
import { daysUntil, initialsOf } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Heart className="h-5 w-5 fill-blush-400 text-blush-400" />
      <span className="font-serif text-xl font-semibold tracking-tight">
        Everly
      </span>
    </Link>
  );
}

function Countdown() {
  const { data: settings } = useWeddingSettings();
  const days = daysUntil(settings?.wedding_date);

  if (days === null) return null;

  const label =
    days > 0
      ? `${days} ${days === 1 ? "day" : "days"} to go`
      : days === 0
        ? "Today is the day"
        : "Married";

  return (
    <span className="hidden rounded-full border border-blush-200 bg-blush-50 px-3 py-1 text-xs font-medium text-blush-700 sm:inline-block">
      {label}
    </span>
  );
}

function UserMenu() {
  const user = useUser();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  async function signOut() {
    setIsSigningOut(true);
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Account menu"
        >
          {initialsOf(user.email.split("@")[0] ?? "") || "?"}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut} disabled={isSigningOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <div className="app-canvas min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card/70 px-4 py-6 backdrop-blur lg:flex">
        <div className="px-2">
          <Wordmark />
        </div>
        <div className="mt-8 flex-1">
          <Nav />
        </div>
        <p className="px-3 text-xs text-muted-foreground">
          Everly keeps everything in your own Supabase project.
        </p>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6 lg:px-8">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Move between the planner sections.
              </SheetDescription>
              <Wordmark />
              <div className="mt-8">
                <Nav onNavigate={() => setMobileNavOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="lg:hidden">
            <Wordmark />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Countdown />
            <UserMenu />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <WorkspaceGate>{children}</WorkspaceGate>
        </main>
      </div>
    </div>
  );
}
