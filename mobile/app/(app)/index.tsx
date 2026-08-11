import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { Card, Checkbox, Chip, ProgressBar, StatCard } from "@/components/ui";
import { RSVP_STATUSES, TIMELINE_PHASE_LABELS } from "@/lib/constants";
import { daysUntil, formatCurrency, formatDate, percentOf } from "@/lib/format";
import { summariseBudget, useBudgetCategories, useExpenses } from "@/lib/hooks/use-budget";
import { summariseGuests, useGuests } from "@/lib/hooks/use-guests";
import { summariseTasks, useTimelineTasks, useToggleTask } from "@/lib/hooks/use-timeline";
import { summariseVendors, useVendors } from "@/lib/hooks/use-vendors";
import { useWeddingSettings } from "@/lib/hooks/use-wedding";
import { colors, fonts, radius } from "@/lib/theme";
import { upcomingTasks } from "@/lib/timeline";

export default function DashboardScreen() {
  const settingsQuery = useWeddingSettings();
  const guestsQuery = useGuests();
  const categoriesQuery = useBudgetCategories();
  const expensesQuery = useExpenses();
  const tasksQuery = useTimelineTasks();
  const vendorsQuery = useVendors();
  const toggleTask = useToggleTask();

  const settings = settingsQuery.data;
  const guests = React.useMemo(() => guestsQuery.data ?? [], [guestsQuery.data]);
  const tasks = React.useMemo(() => tasksQuery.data ?? [], [tasksQuery.data]);
  const vendors = React.useMemo(() => vendorsQuery.data ?? [], [vendorsQuery.data]);

  const guestStats = React.useMemo(() => summariseGuests(guests), [guests]);
  const taskStats = React.useMemo(() => summariseTasks(tasks), [tasks]);
  const vendorStats = React.useMemo(() => summariseVendors(vendors), [vendors]);
  const budget = React.useMemo(
    () => summariseBudget(categoriesQuery.data ?? [], expensesQuery.data ?? []),
    [categoriesQuery.data, expensesQuery.data],
  );

  const nextTasks = React.useMemo(() => upcomingTasks(tasks, 5), [tasks]);
  const totalBudget = settings?.total_budget ?? 0;
  const overBudget = budget.totalSpent > totalBudget;
  const days = daysUntil(settings?.wedding_date);

  const refetchAll = React.useCallback(() => {
    settingsQuery.refetch();
    guestsQuery.refetch();
    categoriesQuery.refetch();
    expensesQuery.refetch();
    tasksQuery.refetch();
    vendorsQuery.refetch();
  }, [settingsQuery, guestsQuery, categoriesQuery, expensesQuery, tasksQuery, vendorsQuery]);

  if (!settings) return null;

  return (
    <Screen
      title={`${settings.partner_one_name} & ${settings.partner_two_name}`}
      description={[formatDate(settings.wedding_date), settings.venue_name]
        .filter(Boolean)
        .join(" · ")}
      onRefresh={refetchAll}
      refreshing={guestsQuery.isFetching && !guestsQuery.isPending}
    >
      {days !== null ? (
        <Card style={styles.countdown}>
          <Text style={styles.countdownNumber}>
            {days > 0 ? days : days === 0 ? "Today" : "♥"}
          </Text>
          <Text style={styles.countdownLabel}>
            {days > 1
              ? "DAYS TO GO"
              : days === 1
                ? "DAY TO GO"
                : days === 0
                  ? "IS THE DAY"
                  : "MARRIED"}
          </Text>
        </Card>
      ) : null}

      <View style={styles.grid}>
        <StatCard
          label="Guests attending"
          value={String(guestStats.attending)}
          hint={`${guestStats.invited} invited · ${guestStats.pending} awaiting`}
          tone="blush"
        />
        <StatCard
          label="Vendors booked"
          value={String(vendorStats.booked)}
          hint={`${vendorStats.outstandingLeads} to confirm`}
          tone="blush"
        />
      </View>

      <StatCard
        label="Budget spent"
        value={formatCurrency(budget.totalSpent)}
        hint={
          overBudget
            ? `${formatCurrency(budget.totalSpent - totalBudget)} over budget`
            : `${formatCurrency(totalBudget - budget.totalSpent)} left of ${formatCurrency(totalBudget)}`
        }
        tone={overBudget ? "blush" : "champagne"}
        progress={percentOf(budget.totalSpent, totalBudget)}
        progressTone={overBudget ? "blush" : "champagne"}
      />

      <StatCard
        label="Checklist"
        value={`${taskStats.completed}/${taskStats.total}`}
        hint={`${Math.round(taskStats.percentComplete)}% complete`}
        tone="sage"
        progress={taskStats.percentComplete}
        progressTone="sage"
      />

      <Card>
        <Text style={styles.cardTitle}>Up next</Text>
        <Text style={styles.cardSub}>The earliest open tasks on your checklist.</Text>

        {nextTasks.length === 0 ? (
          <Text style={styles.emptyLine}>Everything is ticked off. Go enjoy yourselves.</Text>
        ) : (
          <View style={{ marginTop: 12 }}>
            {nextTasks.map((task, index) => {
              const overdue = (daysUntil(task.due_date) ?? 1) < 0;
              return (
                <View
                  key={task.id}
                  style={[styles.taskRow, index > 0 && styles.divided]}
                >
                  <Checkbox
                    checked={task.completed}
                    accessibilityLabel={`Mark ${task.title} complete`}
                    onToggle={() =>
                      toggleTask.mutate({ id: task.id, completed: !task.completed })
                    }
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={[styles.taskMeta, overdue && { color: colors.roseInk }]}>
                      {TIMELINE_PHASE_LABELS[task.phase]}
                      {task.due_date
                        ? ` · ${overdue ? "overdue, " : ""}due ${formatDate(task.due_date)}`
                        : ""}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>RSVPs</Text>
        <Text style={styles.cardSub}>By head count, not invitations.</Text>

        <View style={{ marginTop: 16, gap: 14 }}>
          {RSVP_STATUSES.map((status) => {
            const count =
              status.value === "yes"
                ? guestStats.attending
                : status.value === "no"
                  ? guestStats.declined
                  : status.value === "maybe"
                    ? guestStats.maybe
                    : guestStats.pending;

            return (
              <View key={status.value}>
                <View style={styles.rsvpRow}>
                  <Chip label={status.label} tone={status.tone} />
                  <Text style={styles.rsvpCount}>{count}</Text>
                </View>
                <View style={{ marginTop: 6 }}>
                  <ProgressBar
                    value={percentOf(count, guestStats.invited)}
                    tone={status.tone === "neutral" ? "neutral" : status.tone}
                    height={5}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  countdown: { alignItems: "center", paddingVertical: 22 },
  countdownNumber: { fontFamily: fonts.serif, fontSize: 44, color: colors.roseInk },
  countdownLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.muted,
    marginTop: 4,
  },

  grid: { flexDirection: "row", gap: 12 },

  cardTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.ink },
  cardSub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginTop: 2 },
  emptyLine: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    marginTop: 16,
  },

  taskRow: { flexDirection: "row", gap: 12, paddingVertical: 12 },
  divided: { borderTopWidth: 1, borderTopColor: colors.border },
  taskTitle: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink },
  taskMeta: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 2 },

  rsvpRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rsvpCount: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink },
});
