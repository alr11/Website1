"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarHeart,
  CheckCircle2,
  ListChecks,
  MapPin,
  Pencil,
  Store,
  Users,
  Wallet,
} from "lucide-react";

import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { WeddingDetailsDialog } from "@/components/workspace/wedding-details-dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { RSVP_STATUSES, TIMELINE_PHASE_LABELS } from "@/lib/constants";
import { daysUntil, formatCurrency, formatDate, percentOf } from "@/lib/format";
import { summariseBudget, useBudgetCategories, useExpenses } from "@/lib/hooks/use-budget";
import { summariseGuests, useGuests } from "@/lib/hooks/use-guests";
import {
  summariseTasks,
  useTimelineTasks,
  useToggleTask,
} from "@/lib/hooks/use-timeline";
import { summariseVendors, useVendors } from "@/lib/hooks/use-vendors";
import { useWeddingSettings } from "@/lib/hooks/use-wedding";
import { upcomingTasks } from "@/lib/timeline";
import { cn } from "@/lib/utils";

export function DashboardView() {
  const { data: settings } = useWeddingSettings();
  const guestsQuery = useGuests();
  const categoriesQuery = useBudgetCategories();
  const expensesQuery = useExpenses();
  const tasksQuery = useTimelineTasks();
  const vendorsQuery = useVendors();
  const toggleTask = useToggleTask();

  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const guests = React.useMemo(() => guestsQuery.data ?? [], [guestsQuery.data]);
  const tasks = React.useMemo(() => tasksQuery.data ?? [], [tasksQuery.data]);
  const vendors = React.useMemo(
    () => vendorsQuery.data ?? [],
    [vendorsQuery.data],
  );

  const guestStats = React.useMemo(() => summariseGuests(guests), [guests]);
  const taskStats = React.useMemo(() => summariseTasks(tasks), [tasks]);
  const vendorStats = React.useMemo(() => summariseVendors(vendors), [vendors]);
  const budget = React.useMemo(
    () =>
      summariseBudget(categoriesQuery.data ?? [], expensesQuery.data ?? []),
    [categoriesQuery.data, expensesQuery.data],
  );

  const isLoading =
    guestsQuery.isPending ||
    tasksQuery.isPending ||
    vendorsQuery.isPending ||
    categoriesQuery.isPending ||
    expensesQuery.isPending;

  const totalBudget = settings?.total_budget ?? 0;
  const budgetPercent = Math.min(100, percentOf(budget.totalSpent, totalBudget));
  const overBudget = budget.totalSpent > totalBudget;
  const days = daysUntil(settings?.wedding_date);
  const nextTasks = React.useMemo(() => upcomingTasks(tasks, 6), [tasks]);

  const topCategories = React.useMemo(
    () =>
      [...budget.rollups].sort((a, b) => b.spent - a.spent).slice(0, 5),
    [budget.rollups],
  );

  if (!settings) return null;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hero */}
      <Card className="overflow-hidden border-blush-100">
        <div className="relative bg-[radial-gradient(at_15%_20%,theme(colors.blush.100)_0px,transparent_50%),radial-gradient(at_85%_80%,theme(colors.sage.100)_0px,transparent_50%)] px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-blush-600">
                The wedding of
              </p>
              {/* The explicit spaces keep the accessible name readable as
                  "Amelia & Jonah" rather than "Amelia&Jonah". */}
              <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                {settings.partner_one_name}{" "}
                <span className="mx-3 text-blush-400">&amp;</span>{" "}
                {settings.partner_two_name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CalendarHeart className="h-4 w-4 text-blush-500" />
                  {formatDate(settings.wedding_date)}
                </span>
                {settings.venue_name ? (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-sage-500" />
                    {settings.venue_name}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-4 sm:flex-col sm:items-end">
              {days !== null ? (
                <div className="rounded-xl border border-blush-200 bg-card/80 px-5 py-3 text-center shadow-sm">
                  <p className="font-serif text-3xl font-semibold text-blush-700">
                    {days > 0 ? days : days === 0 ? "Today" : "♥"}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {days > 0
                      ? days === 1
                        ? "day to go"
                        : "days to go"
                      : days === 0
                        ? "is the day"
                        : "married"}
                  </p>
                </div>
              ) : null}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDetailsOpen(true)}
              >
                <Pencil />
                Edit details
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Overview cards */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Guests attending"
            value={String(guestStats.attending)}
            hint={`${guestStats.invited} invited · ${guestStats.pending} awaiting reply`}
            icon={Users}
          />

          <StatCard
            label="Budget spent"
            value={formatCurrency(budget.totalSpent)}
            hint={
              overBudget
                ? `${formatCurrency(budget.totalSpent - totalBudget)} over budget`
                : `${formatCurrency(totalBudget - budget.totalSpent)} left of ${formatCurrency(totalBudget)}`
            }
            icon={Wallet}
            accentClassName={
              overBudget
                ? "bg-blush-100 text-blush-600"
                : "bg-champagne-100 text-champagne-600"
            }
          >
            <Progress
              value={budgetPercent}
              indicatorClassName={overBudget ? "bg-blush-500" : "bg-champagne-500"}
              aria-label="Budget used"
            />
          </StatCard>

          <StatCard
            label="Checklist"
            value={`${taskStats.completed}/${taskStats.total}`}
            hint={`${Math.round(taskStats.percentComplete)}% complete`}
            icon={ListChecks}
            accentClassName="bg-sage-100 text-sage-600"
          >
            <Progress
              value={taskStats.percentComplete}
              indicatorClassName="bg-sage-500"
              aria-label="Checklist progress"
            />
          </StatCard>

          <StatCard
            label="Vendors booked"
            value={String(vendorStats.booked)}
            hint={`${vendorStats.outstandingLeads} still to confirm`}
            icon={Store}
            accentClassName="bg-blush-100 text-blush-600"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="font-serif text-xl">Up next</CardTitle>
              <CardDescription>
                The earliest open tasks on your checklist.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/timeline">
                All tasks
                <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {tasksQuery.isPending ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            ) : nextTasks.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-sage-500" />
                <p className="font-medium">Everything is ticked off</p>
                <p className="text-sm text-muted-foreground">
                  Nothing left on the checklist. Go enjoy yourselves.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {nextTasks.map((task) => {
                  const overdue = (daysUntil(task.due_date) ?? 1) < 0;

                  return (
                    <li
                      key={task.id}
                      className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <Checkbox
                        className="mt-0.5"
                        checked={task.completed}
                        aria-label={`Mark "${task.title}" complete`}
                        onCheckedChange={(checked) =>
                          toggleTask.mutate({
                            id: task.id,
                            completed: checked === true,
                          })
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{task.title}</p>
                        <p
                          className={cn(
                            "mt-0.5 text-xs",
                            overdue ? "text-blush-600" : "text-muted-foreground",
                          )}
                        >
                          {TIMELINE_PHASE_LABELS[task.phase]}
                          {task.due_date
                            ? ` · ${overdue ? "overdue, " : ""}due ${formatDate(task.due_date)}`
                            : ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* RSVP breakdown */}
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="font-serif text-xl">RSVPs</CardTitle>
              <CardDescription>By head count, not invitations.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/guests">
                Guests
                <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <div key={status.value} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <StatusBadge
                      label={status.label}
                      className={status.className}
                    />
                    <span className="font-medium">{count}</span>
                  </div>
                  <Progress
                    value={percentOf(count, guestStats.invited)}
                    className="h-1.5"
                    indicatorClassName={
                      status.value === "yes"
                        ? "bg-sage-500"
                        : status.value === "no"
                          ? "bg-blush-400"
                          : status.value === "maybe"
                            ? "bg-champagne-500"
                            : "bg-muted-foreground/40"
                    }
                    aria-label={`${status.label} head count`}
                  />
                </div>
              );
            })}

            {guestStats.invited === 0 ? (
              <p className="pt-2 text-sm text-muted-foreground">
                No guests yet —{" "}
                <Link
                  href="/guests"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  start the list
                </Link>
                .
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Spending by category */}
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="font-serif text-xl">
              Biggest spends
            </CardTitle>
            <CardDescription>
              Your five heaviest categories so far.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/budget">
              Budget
              <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {topCategories.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">
              No categories yet.{" "}
              <Link
                href="/budget"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Set up your budget
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-4">
              {topCategories.map((category) => {
                const over = category.spent > category.allocated;

                return (
                  <li key={category.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate font-medium">
                        {category.name}
                      </span>
                      <span className="ml-3 whitespace-nowrap text-muted-foreground">
                        {formatCurrency(category.spent)} /{" "}
                        {formatCurrency(category.allocated)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        percentOf(category.spent, category.allocated),
                      )}
                      className="h-1.5"
                      indicatorClassName={over ? "bg-blush-500" : "bg-sage-500"}
                      aria-label={`${category.name} spending`}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <WeddingDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        settings={settings}
      />
    </div>
  );
}
