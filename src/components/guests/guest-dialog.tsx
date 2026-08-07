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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GUEST_ROLES, GUEST_SIDES, RSVP_STATUSES } from "@/lib/constants";
import type { GuestInput } from "@/lib/hooks/use-guests";
import { useCreateGuest, useUpdateGuest } from "@/lib/hooks/use-guests";
import type { Guest, GuestSide, RsvpStatus } from "@/lib/types";

const EMPTY: GuestInput = {
  first_name: "",
  last_name: "",
  email: null,
  phone: null,
  rsvp_status: "pending",
  party_size: 1,
  side: "both",
  role: "Guest",
  table_number: null,
  dietary_notes: null,
  notes: null,
};

function toForm(guest: Guest | null): GuestInput {
  if (!guest) return EMPTY;
  return {
    first_name: guest.first_name,
    last_name: guest.last_name,
    email: guest.email,
    phone: guest.phone,
    rsvp_status: guest.rsvp_status,
    party_size: guest.party_size,
    side: guest.side,
    role: guest.role,
    table_number: guest.table_number,
    dietary_notes: guest.dietary_notes,
    notes: guest.notes,
  };
}

export function GuestDialog({
  open,
  onOpenChange,
  guest,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `null` opens the dialog in "add" mode. */
  guest: Guest | null;
}) {
  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();
  const [form, setForm] = React.useState<GuestInput>(() => toForm(guest));

  // Re-seed the form whenever the dialog opens for a different guest.
  React.useEffect(() => {
    if (open) setForm(toForm(guest));
  }, [open, guest]);

  const isPending = createGuest.isPending || updateGuest.isPending;

  function update<K extends keyof GuestInput>(key: K, value: GuestInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: GuestInput = {
      ...form,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email?.trim() || null,
      phone: form.phone?.trim() || null,
      table_number: form.table_number?.trim() || null,
      dietary_notes: form.dietary_notes?.trim() || null,
      notes: form.notes?.trim() || null,
      party_size: Math.max(1, Number(form.party_size) || 1),
    };

    try {
      if (guest) {
        await updateGuest.mutateAsync({ id: guest.id, ...payload });
      } else {
        await createGuest.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {
      // The mutation hooks surface the error as a toast.
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{guest ? "Edit guest" : "Add a guest"}</DialogTitle>
          <DialogDescription>
            Party size covers plus-ones and children, so head counts stay
            accurate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              required
              value={form.first_name}
              onChange={(event) => update("first_name", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              required
              value={form.last_name}
              onChange={(event) => update("last_name", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email ?? ""}
              onChange={(event) => update("email", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone ?? ""}
              onChange={(event) => update("phone", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rsvp_status">RSVP</Label>
            <Select
              value={form.rsvp_status}
              onValueChange={(value) =>
                update("rsvp_status", value as RsvpStatus)
              }
            >
              <SelectTrigger id="rsvp_status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RSVP_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="party_size">Party size</Label>
            <Input
              id="party_size"
              type="number"
              min={1}
              value={form.party_size}
              onChange={(event) =>
                update("party_size", Number(event.target.value))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="side">Side</Label>
            <Select
              value={form.side}
              onValueChange={(value) => update("side", value as GuestSide)}
            >
              <SelectTrigger id="side">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GUEST_SIDES.map((side) => (
                  <SelectItem key={side.value} value={side.value}>
                    {side.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={form.role ?? "Guest"}
              onValueChange={(value) => update("role", value)}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GUEST_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="table_number">Table</Label>
            <Input
              id="table_number"
              placeholder="e.g. 4 or Head table"
              value={form.table_number ?? ""}
              onChange={(event) => update("table_number", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietary_notes">Dietary needs</Label>
            <Input
              id="dietary_notes"
              placeholder="Vegetarian, nut allergy…"
              value={form.dietary_notes ?? ""}
              onChange={(event) => update("dietary_notes", event.target.value)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={form.notes ?? ""}
              onChange={(event) => update("notes", event.target.value)}
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
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {guest ? "Save changes" : "Add guest"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
