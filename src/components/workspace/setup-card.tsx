"use client";

import * as React from "react";
import { addMonths, format } from "date-fns";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateWorkspace } from "@/lib/hooks/use-wedding";

const DEFAULT_DATE = format(addMonths(new Date(), 12), "yyyy-MM-dd");

/** First-run onboarding. Seeds the checklist and the budget categories. */
export function SetupCard() {
  const createWorkspace = useCreateWorkspace();

  const [form, setForm] = React.useState({
    partner_one_name: "",
    partner_two_name: "",
    wedding_date: DEFAULT_DATE,
    venue_name: "",
    total_budget: "30000",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createWorkspace.mutate({
      partner_one_name: form.partner_one_name.trim() || "Partner 1",
      partner_two_name: form.partner_two_name.trim() || "Partner 2",
      wedding_date: form.wedding_date || null,
      venue_name: form.venue_name.trim() || null,
      total_budget: Number(form.total_budget) || 0,
    });
  }

  return (
    <Card className="mx-auto max-w-2xl animate-fade-in">
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="font-serif text-2xl">
          Let&apos;s set up your wedding
        </CardTitle>
        <CardDescription>
          Five details, and we&apos;ll build your checklist, split your budget
          into categories and start the countdown.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="partner_one_name">Partner 1</Label>
            <Input
              id="partner_one_name"
              value={form.partner_one_name}
              onChange={(event) =>
                update("partner_one_name", event.target.value)
              }
              placeholder="Alex"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner_two_name">Partner 2</Label>
            <Input
              id="partner_two_name"
              value={form.partner_two_name}
              onChange={(event) =>
                update("partner_two_name", event.target.value)
              }
              placeholder="Sam"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wedding_date">Wedding date</Label>
            <Input
              id="wedding_date"
              type="date"
              value={form.wedding_date}
              onChange={(event) => update("wedding_date", event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Checklist due dates are worked out from this.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_budget">Total budget</Label>
            <Input
              id="total_budget"
              type="number"
              min={0}
              step={100}
              value={form.total_budget}
              onChange={(event) => update("total_budget", event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Split across ten categories you can edit later.
            </p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="venue_name">Venue (optional)</Label>
            <Input
              id="venue_name"
              value={form.venue_name}
              onChange={(event) => update("venue_name", event.target.value)}
              placeholder="Still deciding"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={createWorkspace.isPending}
          >
            {createWorkspace.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Create my planner
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
