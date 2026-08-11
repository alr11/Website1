import * as React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import {
  Button,
  Card,
  Checkbox,
  EmptyState,
  ErrorState,
  LoadingState,
  FormSheet,
  ProgressBar,
  SelectField,
  StatCard,
  TextField,
} from "@/components/ui";
import { formatCurrency, formatDate, percentOf } from "@/lib/format";
import {
  summariseBudget,
  useBudgetCategories,
  useCreateCategory,
  useCreateExpense,
  useDeleteExpense,
  useExpenses,
  useUpdateExpense,
} from "@/lib/hooks/use-budget";
import { useWeddingSettings } from "@/lib/hooks/use-wedding";
import { colors, fonts } from "@/lib/theme";
import type { Expense } from "@/lib/types";
import type { ToneName } from "@/lib/theme";

/** Green while comfortable, amber when close, rose once over. */
function tone(spent: number, allocated: number): ToneName {
  const ratio = allocated ? spent / allocated : spent > 0 ? Infinity : 0;
  if (ratio > 1) return "blush";
  if (ratio >= 0.9) return "champagne";
  return "sage";
}

export default function BudgetScreen() {
  const { data: settings } = useWeddingSettings();
  const categoriesQuery = useBudgetCategories();
  const expensesQuery = useExpenses();
  const createCategory = useCreateCategory();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const [tab, setTab] = React.useState<"categories" | "expenses">("categories");
  const [expenseOpen, setExpenseOpen] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);

  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<string>("none");
  const [categoryName, setCategoryName] = React.useState("");
  const [allocated, setAllocated] = React.useState("0");

  const categories = React.useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);
  const expenses = React.useMemo(() => expensesQuery.data ?? [], [expensesQuery.data]);
  const summary = React.useMemo(
    () => summariseBudget(categories, expenses),
    [categories, expenses],
  );

  const totalBudget = settings?.total_budget ?? 0;
  const remaining = totalBudget - summary.totalSpent;

  function openExpense(preset?: string) {
    setDescription("");
    setAmount("");
    setCategoryId(preset ?? "none");
    setExpenseOpen(true);
  }

  async function submitExpense() {
    if (!description.trim()) return;
    try {
      await createExpense.mutateAsync({
        description: description.trim(),
        amount: Math.max(0, Number(amount) || 0),
        category_id: categoryId === "none" ? null : categoryId,
        vendor_id: null,
        paid: false,
        due_date: null,
      });
      setExpenseOpen(false);
    } catch {
      // Reported as a toast by the hook.
    }
  }

  async function submitCategory() {
    if (!categoryName.trim()) return;
    try {
      await createCategory.mutateAsync({
        name: categoryName.trim(),
        allocated: Math.max(0, Number(allocated) || 0),
      });
      setCategoryName("");
      setAllocated("0");
      setCategoryOpen(false);
    } catch {
      // Reported as a toast by the hook.
    }
  }

  function confirmDeleteExpense(expense: Expense) {
    Alert.alert("Delete this expense?", `"${expense.description}" will be removed.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteExpense.mutate(expense.id),
      },
    ]);
  }

  const isPending = categoriesQuery.isPending || expensesQuery.isPending;
  const isError = categoriesQuery.isError || expensesQuery.isError;

  return (
    <Screen
      title="Budget"
      description="Planned, spent, and still owed."
      action={<Button title="Expense" onPress={() => openExpense()} />}
      onRefresh={() => {
        categoriesQuery.refetch();
        expensesQuery.refetch();
      }}
      refreshing={expensesQuery.isFetching && !expensesQuery.isPending}
    >
      <View style={styles.grid}>
        <StatCard label="Total budget" value={formatCurrency(totalBudget)} />
        <StatCard
          label="Spent"
          value={formatCurrency(summary.totalSpent)}
          hint={`${Math.round(percentOf(summary.totalSpent, totalBudget))}% of budget`}
          tone="champagne"
          progress={percentOf(summary.totalSpent, totalBudget)}
          progressTone={tone(summary.totalSpent, totalBudget)}
        />
      </View>
      <View style={styles.grid}>
        <StatCard
          label={remaining < 0 ? "Over budget" : "Left to spend"}
          value={formatCurrency(Math.abs(remaining))}
          tone={remaining < 0 ? "blush" : "sage"}
        />
        <StatCard
          label="Still owed"
          value={formatCurrency(summary.outstanding)}
          hint={`${formatCurrency(summary.totalPaid)} paid`}
          tone="blush"
        />
      </View>

      <View style={styles.tabs}>
        {(["categories", "expenses"] as const).map((key) => (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === key }}
            onPress={() => setTab(key)}
            style={[styles.tab, tab === key && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
              {key === "categories" ? "Categories" : `Expenses (${expenses.length})`}
            </Text>
          </Pressable>
        ))}
      </View>

      {isPending ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState
          error={categoriesQuery.error ?? expensesQuery.error}
          onRetry={() => {
            categoriesQuery.refetch();
            expensesQuery.refetch();
          }}
        />
      ) : tab === "categories" ? (
        categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Add a category to start splitting the budget into pieces you can track."
            action={<Button title="Add category" onPress={() => setCategoryOpen(true)} />}
          />
        ) : (
          <>
            {summary.rollups.map((rollup) => {
              const t = tone(rollup.spent, rollup.allocated);
              return (
                <Card key={rollup.id}>
                  <View style={styles.rowTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{rollup.name}</Text>
                      <Text style={styles.meta}>
                        {rollup.expenseCount}{" "}
                        {rollup.expenseCount === 1 ? "expense" : "expenses"} ·{" "}
                        {formatCurrency(rollup.spent)} of {formatCurrency(rollup.allocated)}
                      </Text>
                    </View>
                    <Text style={styles.left}>
                      {rollup.remaining < 0
                        ? `${formatCurrency(Math.abs(rollup.remaining))} over`
                        : `${formatCurrency(rollup.remaining)} left`}
                    </Text>
                  </View>
                  <View style={{ marginTop: 12 }}>
                    <ProgressBar value={percentOf(rollup.spent, rollup.allocated)} tone={t} />
                  </View>
                  <Button
                    title="Add expense here"
                    variant="ghost"
                    onPress={() => openExpense(rollup.id)}
                    style={{ marginTop: 8 }}
                  />
                </Card>
              );
            })}
            <Button title="Add category" variant="outline" onPress={() => setCategoryOpen(true)} />
          </>
        )
      ) : expenses.length === 0 ? (
        <EmptyState
          title="Nothing logged yet"
          description="Log deposits and invoices as they happen — the category bars update straight away."
          action={<Button title="Log an expense" onPress={() => openExpense()} />}
        />
      ) : (
        expenses.map((expense) => {
          const category = categories.find((item) => item.id === expense.category_id);
          return (
            <Card key={expense.id}>
              <View style={styles.rowTop}>
                <Checkbox
                  checked={expense.paid}
                  accessibilityLabel={`Mark ${expense.description} paid`}
                  onToggle={() =>
                    updateExpense.mutate({ id: expense.id, paid: !expense.paid })
                  }
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{expense.description}</Text>
                  <Text style={styles.meta}>
                    {category?.name ?? "Uncategorised"}
                    {expense.due_date ? ` · due ${formatDate(expense.due_date)}` : ""}
                  </Text>
                </View>
                <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
              </View>
              <Button
                title="Delete"
                variant="ghost"
                onPress={() => confirmDeleteExpense(expense)}
                style={{ marginTop: 8 }}
              />
            </Card>
          );
        })
      )}

      {summary.uncategorised > 0 && tab === "categories" ? (
        <Text style={styles.note}>
          {formatCurrency(summary.uncategorised)} of spending is not assigned to a category yet.
        </Text>
      ) : null}

      <FormSheet
        visible={expenseOpen}
        title="Log an expense"
        description="Log the full amount now and tick it paid once the money has left your account."
        submitLabel="Log expense"
        isPending={createExpense.isPending}
        onSubmit={submitExpense}
        onClose={() => setExpenseOpen(false)}
      >
        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Venue deposit"
        />
        <TextField
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
        />
        <SelectField
          label="Category"
          value={categoryId}
          onChange={setCategoryId}
          options={[
            { value: "none", label: "Uncategorised" },
            ...categories.map((category) => ({ value: category.id, label: category.name })),
          ]}
        />
      </FormSheet>

      <FormSheet
        visible={categoryOpen}
        title="New budget category"
        description="Allocations are what you plan to spend."
        submitLabel="Add category"
        isPending={createCategory.isPending}
        onSubmit={submitCategory}
        onClose={() => setCategoryOpen(false)}
      >
        <TextField
          label="Name"
          value={categoryName}
          onChangeText={setCategoryName}
          placeholder="Honeymoon fund"
        />
        <TextField
          label="Allocated"
          value={allocated}
          onChangeText={setAllocated}
          keyboardType="number-pad"
        />
      </FormSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", gap: 12 },
  tabs: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: 10,
    backgroundColor: "#f0ebe4",
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 7, alignItems: "center" },
  tabActive: { backgroundColor: colors.card },
  tabText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.muted },
  tabTextActive: { color: colors.ink },

  rowTop: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  name: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.ink },
  meta: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 3 },
  left: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink },
  amount: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.ink },
  note: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    backgroundColor: colors.neutralTint,
    padding: 14,
    borderRadius: 10,
  },
});
