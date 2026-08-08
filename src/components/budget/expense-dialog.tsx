"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { ExpenseInput } from "@/lib/hooks/use-budget";
import {
  useBudgetCategories,
  useCreateExpense,
  useUpdateExpense,
} from "@/lib/hooks/use-budget";
import { useVendors } from "@/lib/hooks/use-vendors";
import type { Expense } from "@/lib/types";

/** Radix Select cannot hold an empty string value, so "none" stands in for null. */
const NONE = "none";

const EMPTY: ExpenseInput = {
  description: "",
  amount: 0,
  category_id: null,
  vendor_id: null,
  paid: false,
  due_date: null,
};

export function ExpenseDialog({
  open,
  onOpenChange,
  expense,
  defaultCategoryId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
  defaultCategoryId?: string | null;
}) {
  const { data: categories } = useBudgetCategories();
  const { data: vendors } = useVendors();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const [form, setForm] = React.useState<ExpenseInput>(EMPTY);
  const [amount, setAmount] = React.useState("0");

  React.useEffect(() => {
    if (!open) return;

    if (expense) {
      setForm({
        description: expense.description,
        amount: expense.amount,
        category_id: expense.category_id,
        vendor_id: expense.vendor_id,
        paid: expense.paid,
        due_date: expense.due_date,
      });
      setAmount(String(expense.amount));
    } else {
      setForm({ ...EMPTY, category_id: defaultCategoryId ?? null });
      setAmount("");
    }
  }, [open, expense, defaultCategoryId]);

  const isPending = createExpense.isPending || updateExpense.isPending;

  function update<K extends keyof ExpenseInput>(key: K, value: ExpenseInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: ExpenseInput = {
      ...form,
      description: form.description.trim(),
      amount: Math.max(0, Number(amount) || 0),
    };

    try {
      if (expense) {
        await updateExpense.mutateAsync({ id: expense.id, ...payload });
      } else {
        await createExpense.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {
      // Errors surface as toasts from the mutation hooks.
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{expense ? "Edit expense" : "Log an expense"}</DialogTitle>
          <DialogDescription>
            Log the full amount now and tick &ldquo;paid&rdquo; once the money
            has actually left your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="expense_description">Description</Label>
            <Input
              id="expense_description"
              required
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Venue deposit"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense_amount">Amount</Label>
            <Input
              id="expense_amount"
              type="number"
              min={0}
              step="0.01"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense_due_date">Due date</Label>
            <Input
              id="expense_due_date"
              type="date"
              value={form.due_date ?? ""}
              onChange={(event) =>
                update("due_date", event.target.value || null)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense_category">Category</Label>
            <Select
              value={form.category_id ?? NONE}
              onValueChange={(value) =>
                update("category_id", value === NONE ? null : value)
              }
            >
              <SelectTrigger id="expense_category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Uncategorised</SelectItem>
                {(categories ?? []).map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense_vendor">Vendor</Label>
            <Select
              value={form.vendor_id ?? NONE}
              onValueChange={(value) =>
                update("vendor_id", value === NONE ? null : value)
              }
            >
              <SelectTrigger id="expense_vendor">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>No vendor</SelectItem>
                {(vendors ?? []).map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 sm:col-span-2">
            <Checkbox
              id="expense_paid"
              checked={form.paid}
              onCheckedChange={(checked) => update("paid", checked === true)}
            />
            <Label htmlFor="expense_paid" className="cursor-pointer">
              Already paid
            </Label>
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
              {expense ? "Save changes" : "Log expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
