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
import { VENDOR_STATUSES, VENDOR_TYPES } from "@/lib/constants";
import type { VendorInput } from "@/lib/hooks/use-vendors";
import { useCreateVendor, useUpdateVendor } from "@/lib/hooks/use-vendors";
import type { Vendor, VendorStatus } from "@/lib/types";

const EMPTY: VendorInput = {
  name: "",
  vendor_type: "Venue",
  contact_name: null,
  email: null,
  phone: null,
  website: null,
  estimated_cost: 0,
  deposit_paid: 0,
  status: "researching",
  notes: null,
};

export function VendorDialog({
  open,
  onOpenChange,
  vendor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
}) {
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();

  const [form, setForm] = React.useState<VendorInput>(EMPTY);
  const [cost, setCost] = React.useState("0");
  const [deposit, setDeposit] = React.useState("0");

  React.useEffect(() => {
    if (!open) return;

    if (vendor) {
      setForm({
        name: vendor.name,
        vendor_type: vendor.vendor_type,
        contact_name: vendor.contact_name,
        email: vendor.email,
        phone: vendor.phone,
        website: vendor.website,
        estimated_cost: vendor.estimated_cost,
        deposit_paid: vendor.deposit_paid,
        status: vendor.status,
        notes: vendor.notes,
      });
      setCost(String(vendor.estimated_cost));
      setDeposit(String(vendor.deposit_paid));
    } else {
      setForm(EMPTY);
      setCost("");
      setDeposit("");
    }
  }, [open, vendor]);

  const isPending = createVendor.isPending || updateVendor.isPending;

  function update<K extends keyof VendorInput>(key: K, value: VendorInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: VendorInput = {
      ...form,
      name: form.name.trim(),
      contact_name: form.contact_name?.trim() || null,
      email: form.email?.trim() || null,
      phone: form.phone?.trim() || null,
      website: form.website?.trim() || null,
      notes: form.notes?.trim() || null,
      estimated_cost: Math.max(0, Number(cost) || 0),
      deposit_paid: Math.max(0, Number(deposit) || 0),
    };

    try {
      if (vendor) {
        await updateVendor.mutateAsync({ id: vendor.id, ...payload });
      } else {
        await createVendor.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {
      // Errors surface as toasts from the mutation hooks.
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{vendor ? "Edit vendor" : "Add a vendor"}</DialogTitle>
          <DialogDescription>
            Keep quotes, contacts and deposits together so nothing gets chased
            twice.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vendor_name">Business name</Label>
            <Input
              id="vendor_name"
              required
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Ivy House Barn"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor_type">Type</Label>
            <Select
              value={form.vendor_type}
              onValueChange={(value) => update("vendor_type", value)}
            >
              <SelectTrigger id="vendor_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENDOR_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor_contact">Contact name</Label>
            <Input
              id="vendor_contact"
              value={form.contact_name ?? ""}
              onChange={(event) => update("contact_name", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor_status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => update("status", value as VendorStatus)}
            >
              <SelectTrigger id="vendor_status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENDOR_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor_email">Email</Label>
            <Input
              id="vendor_email"
              type="email"
              value={form.email ?? ""}
              onChange={(event) => update("email", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor_phone">Phone</Label>
            <Input
              id="vendor_phone"
              value={form.phone ?? ""}
              onChange={(event) => update("phone", event.target.value)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="vendor_website">Website</Label>
            <Input
              id="vendor_website"
              value={form.website ?? ""}
              onChange={(event) => update("website", event.target.value)}
              placeholder="https://"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor_cost">Quoted cost</Label>
            <Input
              id="vendor_cost"
              type="number"
              min={0}
              step="0.01"
              value={cost}
              onChange={(event) => setCost(event.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor_deposit">Deposit paid</Label>
            <Input
              id="vendor_deposit"
              type="number"
              min={0}
              step="0.01"
              value={deposit}
              onChange={(event) => setDeposit(event.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="vendor_notes">Notes</Label>
            <Textarea
              id="vendor_notes"
              rows={3}
              value={form.notes ?? ""}
              onChange={(event) => update("notes", event.target.value)}
              placeholder="What's included, what's still to confirm…"
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
              {vendor ? "Save changes" : "Add vendor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
