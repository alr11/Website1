"use client";

import * as React from "react";
import {
  Banknote,
  PiggyBank,
  Plus,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { CategoryDialog } from "@/components/budget/category-dialog";
import { ExpenseDialog } from "@/components/budget/expense-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryState } from "@/components/shared/query-state";
import { RowMenu } from "@/components/shared/row-menu";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatCurrencyPrecise, formatDate, percentOf } from "@/lib/format";
import {
  summariseBudget,
  useBudgetCategories,
  useDeleteCategory,
  useDeleteExpense,
  useExpenses,
  useUpdateExpense,
} from "@/lib/hooks/use-budget";
import { useWeddingSettings } from "@/lib/hooks/use-wedding";
import { useVendors } from "@/lib/hooks/use-vendors";
import type { BudgetCategory, Expense } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Green while comfortable, amber when close, rose once over. */
function spendTone(spent: number, allocated: number) {
  const ratio = allocated ? spent / allocated : spent > 0 ? Infinity : 0;
  if (ratio > 1) return { bar: "bg-blush-500", text: "text-blush-700" };
  if (ratio >= 0.9) return { bar: "bg-champagne-500", text: "text-champagne-700" };
  return { bar: "bg-sage-500", text: "text-sage-700" };
}

export function BudgetView() {
  const { data: settings } = useWeddingSettings();
  const categoriesQuery = useBudgetCategories();
  const expensesQuery = useExpenses();
  const { data: vendors } = useVendors();
  const updateExpense = useUpdateExpense();
  const deleteCategory = useDeleteCategory();
  const deleteExpense = useDeleteExpense();

  const [categoryDialogOpen, setCategoryDialogOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] =
    React.useState<BudgetCategory | null>(null);
  const [expenseDialogOpen, setExpenseDialogOpen] = React.useState(false);
  const [activeExpense, setActiveExpense] = React.useState<Expense | null>(null);
  const [presetCategoryId, setPresetCategoryId] = React.useState<string | null>(
    null,
  );
  const [pendingCategoryDelete, setPendingCategoryDelete] =
    React.useState<BudgetCategory | null>(null);
  const [pendingExpenseDelete, setPendingExpenseDelete] =
    React.useState<Expense | null>(null);

  const categories = React.useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const expenses = React.useMemo(
    () => expensesQuery.data ?? [],
    [expensesQuery.data],
  );

  const summary = React.useMemo(
    () => summariseBudget(categories, expenses),
    [categories, expenses],
  );

  const totalBudget = settings?.total_budget ?? 0;
  const spentPercent = Math.min(100, percentOf(summary.totalSpent, totalBudget));
  const overallTone = spendTone(summary.totalSpent, totalBudget);
  const remaining = totalBudget - summary.totalSpent;

  const vendorName = React.useCallback(
    (id: string | null) =>
      id ? (vendors ?? []).find((vendor) => vendor.id === id)?.name ?? null : null,
    [vendors],
  );

  const categoryName = React.useCallback(
    (id: string | null) =>
      id ? categories.find((category) => category.id === id)?.name ?? null : null,
    [categories],
  );

  function openAddCategory() {
    setActiveCategory(null);
    setCategoryDialogOpen(true);
  }

  function openAddExpense(categoryId: string | null = null) {
    setActiveExpense(null);
    setPresetCategoryId(categoryId);
    setExpenseDialogOpen(true);
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Budget"
        description="What you planned to spend, what you have actually spent, and what is still owed."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={openAddCategory}>
              <Plus />
              Category
            </Button>
            <Button onClick={() => openAddExpense()}>
              <Plus />
              Expense
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total budget"
          value={formatCurrency(totalBudget)}
          hint={`${formatCurrency(summary.totalAllocated)} allocated to categories`}
          icon={Wallet}
        />
        <StatCard
          label="Spent"
          value={formatCurrency(summary.totalSpent)}
          hint={`${Math.round(percentOf(summary.totalSpent, totalBudget))}% of budget`}
          icon={TrendingUp}
          accentClassName="bg-champagne-100 text-champagne-600"
        >
          <Progress
            value={spentPercent}
            indicatorClassName={overallTone.bar}
            aria-label="Share of budget spent"
          />
        </StatCard>
        <StatCard
          label={remaining < 0 ? "Over budget" : "Left to spend"}
          value={formatCurrency(Math.abs(remaining))}
          hint={
            remaining < 0
              ? "You are past the total budget"
              : "Budget minus everything logged"
          }
          icon={PiggyBank}
          accentClassName={
            remaining < 0
              ? "bg-blush-100 text-blush-600"
              : "bg-sage-100 text-sage-600"
          }
        />
        <StatCard
          label="Still owed"
          value={formatCurrency(summary.outstanding)}
          hint={`${formatCurrency(summary.totalPaid)} already paid`}
          icon={Banknote}
          accentClassName="bg-blush-100 text-blush-600"
        />
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="expenses">
            Expenses{expenses.length ? ` (${expenses.length})` : ""}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">
                Where the money goes
              </CardTitle>
              <CardDescription>
                Each bar shows spending against that category&apos;s allocation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QueryState
                isPending={categoriesQuery.isPending || expensesQuery.isPending}
                isError={categoriesQuery.isError || expensesQuery.isError}
                error={categoriesQuery.error ?? expensesQuery.error}
                onRetry={() => {
                  categoriesQuery.refetch();
                  expensesQuery.refetch();
                }}
              >
                {categories.length === 0 ? (
                  <EmptyState
                    icon={Wallet}
                    title="No categories yet"
                    description="Add a category to start splitting the budget into pieces you can track."
                    action={
                      <Button onClick={openAddCategory}>
                        <Plus />
                        Add category
                      </Button>
                    }
                  />
                ) : (
                  <ul className="space-y-5">
                    {summary.rollups.map((rollup) => {
                      const tone = spendTone(rollup.spent, rollup.allocated);
                      const percent = Math.min(
                        100,
                        percentOf(rollup.spent, rollup.allocated),
                      );

                      return (
                        <li key={rollup.id} className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {rollup.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {rollup.expenseCount}{" "}
                                {rollup.expenseCount === 1
                                  ? "expense"
                                  : "expenses"}{" "}
                                · {formatCurrency(rollup.spent)} of{" "}
                                {formatCurrency(rollup.allocated)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={cn(
                                  "whitespace-nowrap text-sm font-medium",
                                  tone.text,
                                )}
                              >
                                {rollup.remaining < 0
                                  ? `${formatCurrency(Math.abs(rollup.remaining))} over`
                                  : `${formatCurrency(rollup.remaining)} left`}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label={`Add expense to ${rollup.name}`}
                                onClick={() => openAddExpense(rollup.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <RowMenu
                                label={`Actions for ${rollup.name}`}
                                onEdit={() => {
                                  setActiveCategory(rollup);
                                  setCategoryDialogOpen(true);
                                }}
                                onDelete={() =>
                                  setPendingCategoryDelete(rollup)
                                }
                              />
                            </div>
                          </div>
                          <Progress
                            value={percent}
                            indicatorClassName={tone.bar}
                            aria-label={`${rollup.name} spending`}
                          />
                        </li>
                      );
                    })}
                  </ul>
                )}

                {summary.uncategorised > 0 ? (
                  <p className="mt-6 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                    {formatCurrency(summary.uncategorised)} of spending is not
                    assigned to a category yet.
                  </p>
                ) : null}
              </QueryState>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Expenses</CardTitle>
              <CardDescription>
                Tick an expense once it has been paid in full.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QueryState
                isPending={expensesQuery.isPending}
                isError={expensesQuery.isError}
                error={expensesQuery.error}
                onRetry={() => expensesQuery.refetch()}
              >
                {expenses.length === 0 ? (
                  <EmptyState
                    icon={Receipt}
                    title="Nothing logged yet"
                    description="Log deposits and invoices as they happen — the category bars update straight away."
                    action={
                      <Button onClick={() => openAddExpense()}>
                        <Plus />
                        Log an expense
                      </Button>
                    }
                  />
                ) : (
                  <>
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Paid</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Due</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-12" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                              <TableCell>
                                <Checkbox
                                  checked={expense.paid}
                                  aria-label={`Mark ${expense.description} paid`}
                                  onCheckedChange={(checked) =>
                                    updateExpense.mutate({
                                      id: expense.id,
                                      paid: checked === true,
                                    })
                                  }
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {expense.description}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {categoryName(expense.category_id) ?? "—"}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {vendorName(expense.vendor_id) ?? "—"}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDate(expense.due_date)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrencyPrecise(expense.amount)}
                              </TableCell>
                              <TableCell>
                                <RowMenu
                                  label={`Actions for ${expense.description}`}
                                  onEdit={() => {
                                    setActiveExpense(expense);
                                    setExpenseDialogOpen(true);
                                  }}
                                  onDelete={() =>
                                    setPendingExpenseDelete(expense)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <ul className="space-y-3 md:hidden">
                      {expenses.map((expense) => (
                        <li
                          key={expense.id}
                          className="rounded-lg border border-border p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-3">
                              <Checkbox
                                checked={expense.paid}
                                className="mt-0.5"
                                aria-label={`Mark ${expense.description} paid`}
                                onCheckedChange={(checked) =>
                                  updateExpense.mutate({
                                    id: expense.id,
                                    paid: checked === true,
                                  })
                                }
                              />
                              <div className="min-w-0">
                                <p className="truncate font-medium">
                                  {expense.description}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {categoryName(expense.category_id) ??
                                    "Uncategorised"}
                                  {expense.due_date
                                    ? ` · due ${formatDate(expense.due_date)}`
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="whitespace-nowrap font-medium">
                                {formatCurrency(expense.amount)}
                              </span>
                              <RowMenu
                                label={`Actions for ${expense.description}`}
                                onEdit={() => {
                                  setActiveExpense(expense);
                                  setExpenseDialogOpen(true);
                                }}
                                onDelete={() =>
                                  setPendingExpenseDelete(expense)
                                }
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </QueryState>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        category={activeCategory}
      />

      <ExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
        expense={activeExpense}
        defaultCategoryId={presetCategoryId}
      />

      <ConfirmDialog
        open={Boolean(pendingCategoryDelete)}
        onOpenChange={(open) => !open && setPendingCategoryDelete(null)}
        title="Delete this category?"
        description={
          pendingCategoryDelete
            ? `"${pendingCategoryDelete.name}" will be removed. Expenses logged against it are kept but become uncategorised.`
            : ""
        }
        isPending={deleteCategory.isPending}
        onConfirm={() => {
          if (!pendingCategoryDelete) return;
          deleteCategory.mutate(pendingCategoryDelete.id, {
            onSuccess: () => setPendingCategoryDelete(null),
          });
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingExpenseDelete)}
        onOpenChange={(open) => !open && setPendingExpenseDelete(null)}
        title="Delete this expense?"
        description={
          pendingExpenseDelete
            ? `"${pendingExpenseDelete.description}" will be removed from your budget.`
            : ""
        }
        isPending={deleteExpense.isPending}
        onConfirm={() => {
          if (!pendingExpenseDelete) return;
          deleteExpense.mutate(pendingExpenseDelete.id, {
            onSuccess: () => setPendingExpenseDelete(null),
          });
        }}
      />
    </div>
  );
}
