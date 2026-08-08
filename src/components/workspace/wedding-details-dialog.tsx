"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateWeddingSettings } from "@/lib/hooks/use-wedding";
import type { WeddingSettings } from "@/lib/types";

export function WeddingDetailsDialog({
  open,
  onOpenChange,
  settings,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: WeddingSettings;
}) {
  const updateSettings = useUpdateWeddingSettings();

  const [form, setForm] = React.useState({
    partner_one_name: settings.partner_one_name,
    partner_two_name: settings.partner_two_name,
    wedding_date: settings.wedding_date ?? "",
    venue_name: settings.venue_name ?? "",
    total_budget: String(settings.total_budget),
  });

  React.useEffect(() => {
    if (!open) return;
    setForm({
      partner_one_name: settings.partner_one_name,
      partner_two_name: settings.partner_two_name,
      wedding_date: settings.wedding_date ?? "",
      venue_name: settings.venue_name ?? "",
      total_budget: String(settings.total_budget),
    });
  }, [open, settings]);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await updateSettings.mutateAsync({
        partner_one_name: form.partner_one_name.trim() || "Partner 1",
        partner_two_name: form.partner_two_name.trim() || "Partner 2",
        wedding_date: form.wedding_date || null,
        venue_name: form.venue_name.trim() || null,
        total_budget: Math.max(0, Number(form.total_budget) || 0),
      });
      onOpenChange(false);
    } catch {
      // Errors surface as toasts from the mutation hook.
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Wedding details</DialogTitle>
          <DialogDescription>
            Changing the date does not move existing checklist due dates — edit
            those individually if you need to.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="settings_partner_one">Partner 1</Label>
            <Input
              id="settings_partner_one"
              value={form.partner_one_name}
              onChange={(event) =>
                update("partner_one_name", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings_partner_two">Partner 2</Label>
            <Input
              id="settings_partner_two"
              value={form.partner_two_name}
              onChange={(event) =>
                update("partner_two_name", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings_date">Wedding date</Label>
            <Input
              id="settings_date"
              type="date"
              value={form.wedding_date}
              onChange={(event) => update("wedding_date", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings_budget">Total budget</Label>
            <Input
              id="settings_budget"
              type="number"
              min={0}
              step={100}
              value={form.total_budget}
              onChange={(event) => update("total_budget", event.target.value)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="settings_venue">Venue</Label>
            <Input
              id="settings_venue"
              value={form.venue_name}
              onChange={(event) => update("venue_name", event.target.value)}
              placeholder="Still deciding"
            />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateSettings.isPending}>
              {updateSettings.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Save details
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
