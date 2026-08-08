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
import { useCreateCategory, useUpdateCategory } from "@/lib/hooks/use-budget";
import type { BudgetCategory } from "@/lib/types";

export function CategoryDialog({
  open,
  onOpenChange,
  category,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: BudgetCategory | null;
}) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [name, setName] = React.useState("");
  const [allocated, setAllocated] = React.useState("0");

  React.useEffect(() => {
    if (!open) return;
    setName(category?.name ?? "");
    setAllocated(String(category?.allocated ?? 0));
  }, [open, category]);

  const isPending = createCategory.isPending || updateCategory.isPending;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      name: name.trim(),
      allocated: Math.max(0, Number(allocated) || 0),
    };

    try {
      if (category) {
        await updateCategory.mutateAsync({ id: category.id, ...payload });
      } else {
        await createCategory.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {
      // Errors surface as toasts from the mutation hooks.
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit category" : "New budget category"}
          </DialogTitle>
          <DialogDescription>
            Allocations are what you plan to spend. Expenses logged against the
            category count towards it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category_name">Name</Label>
            <Input
              id="category_name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Flowers & Décor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_allocated">Allocated</Label>
            <Input
              id="category_allocated"
              type="number"
              min={0}
              step={50}
              value={allocated}
              onChange={(event) => setAllocated(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {category ? "Save changes" : "Add category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
