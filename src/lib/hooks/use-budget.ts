"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useUser } from "@/components/providers";
import { createClient } from "@/lib/supabase/client";
import type { BudgetCategory, Expense } from "@/lib/types";

import { queryKeys } from "./keys";
import { errorMessage, unwrap } from "./utils";

export interface CategoryInput {
  name: string;
  allocated: number;
}

export interface ExpenseInput {
  description: string;
  amount: number;
  category_id: string | null;
  vendor_id: string | null;
  paid: boolean;
  due_date: string | null;
}

export function useBudgetCategories() {
  const supabase = createClient();

  return useQuery({
    queryKey: queryKeys.budgetCategories,
    queryFn: async () =>
      unwrap<BudgetCategory[]>(
        await supabase
          .from("budget_categories")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
      ),
  });
}

export function useExpenses() {
  const supabase = createClient();

  return useQuery({
    queryKey: queryKeys.expenses,
    queryFn: async () =>
      unwrap<Expense[]>(
        await supabase
          .from("expenses")
          .select("*")
          .order("created_at", { ascending: false }),
      ),
  });
}

export function useCreateCategory() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation({
    mutationFn: async (input: CategoryInput) =>
      unwrap<BudgetCategory>(
        await supabase
          .from("budget_categories")
          .insert({ ...input, user_id: user.id, sort_order: 999 })
          .select()
          .single(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgetCategories });
      toast.success("Category added");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not add that category"));
    },
  });
}

export function useUpdateCategory() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<CategoryInput> & { id: string }) =>
      unwrap<BudgetCategory>(
        await supabase
          .from("budget_categories")
          .update(input)
          .eq("id", id)
          .select()
          .single(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgetCategories });
      toast.success("Category updated");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not update that category"));
    },
  });
}

export function useDeleteCategory() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("budget_categories")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgetCategories });
      // Expenses keep their history but lose the category link.
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      toast.success("Category deleted");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not delete that category"));
    },
  });
}

export function useCreateExpense() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation({
    mutationFn: async (input: ExpenseInput) =>
      unwrap<Expense>(
        await supabase
          .from("expenses")
          .insert({ ...input, user_id: user.id })
          .select()
          .single(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      toast.success("Expense logged");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not log that expense"));
    },
  });
}

export function useUpdateExpense() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<ExpenseInput> & { id: string }) =>
      unwrap<Expense>(
        await supabase
          .from("expenses")
          .update(input)
          .eq("id", id)
          .select()
          .single(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not update that expense"));
    },
  });
}

export function useDeleteExpense() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      toast.success("Expense deleted");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not delete that expense"));
    },
  });
}

export interface CategoryRollup extends BudgetCategory {
  spent: number;
  paid: number;
  remaining: number;
  expenseCount: number;
}

export interface BudgetSummary {
  totalAllocated: number;
  totalSpent: number;
  totalPaid: number;
  outstanding: number;
  uncategorised: number;
  rollups: CategoryRollup[];
}

export function summariseBudget(
  categories: BudgetCategory[],
  expenses: Expense[],
): BudgetSummary {
  const rollups = categories.map((category) => {
    const rows = expenses.filter(
      (expense) => expense.category_id === category.id,
    );
    const spent = rows.reduce((sum, expense) => sum + expense.amount, 0);
    const paid = rows
      .filter((expense) => expense.paid)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      ...category,
      spent,
      paid,
      remaining: category.allocated - spent,
      expenseCount: rows.length,
    };
  });

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPaid = expenses
    .filter((expense) => expense.paid)
    .reduce((sum, expense) => sum + expense.amount, 0);

  return {
    totalAllocated: categories.reduce(
      (sum, category) => sum + category.allocated,
      0,
    ),
    totalSpent,
    totalPaid,
    outstanding: totalSpent - totalPaid,
    uncategorised: expenses
      .filter((expense) => !expense.category_id)
      .reduce((sum, expense) => sum + expense.amount, 0),
    rollups,
  };
}
