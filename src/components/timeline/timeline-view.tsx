"use client";

import * as React from "react";
import { CalendarClock, CheckCircle2, ListChecks, Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryState } from "@/components/shared/query-state";
import { RowMenu } from "@/components/shared/row-menu";
import { TaskDialog } from "@/components/timeline/task-dialog";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TIMELINE_PHASES } from "@/lib/constants";
import { daysUntil, formatDate } from "@/lib/format";
import {
  summariseTasks,
  useDeleteTask,
  useTimelineTasks,
  useToggleTask,
} from "@/lib/hooks/use-timeline";
import { compareTasks } from "@/lib/timeline";
import type { TimelinePhase, TimelineTask } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "open" | "done";

export function TimelineView() {
  const { data, isPending, isError, error, refetch } = useTimelineTasks();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();

  const [filter, setFilter] = React.useState<Filter>("all");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [activeTask, setActiveTask] = React.useState<TimelineTask | null>(null);
  const [defaultPhase, setDefaultPhase] =
    React.useState<TimelinePhase>("6_months");
  const [pendingDelete, setPendingDelete] = React.useState<TimelineTask | null>(
    null,
  );

  const tasks = React.useMemo(() => data ?? [], [data]);
  const stats = React.useMemo(() => summariseTasks(tasks), [tasks]);

  const visible = React.useMemo(() => {
    if (filter === "open") return tasks.filter((task) => !task.completed);
    if (filter === "done") return tasks.filter((task) => task.completed);
    return tasks;
  }, [tasks, filter]);

  const grouped = React.useMemo(() => {
    return TIMELINE_PHASES.map((phase) => ({
      ...phase,
      tasks: visible
        .filter((task) => task.phase === phase.value)
        .sort(compareTasks),
      total: tasks.filter((task) => task.phase === phase.value).length,
      done: tasks.filter((task) => task.phase === phase.value && task.completed)
        .length,
    })).filter((phase) => phase.tasks.length > 0 || phase.total > 0);
  }, [visible, tasks]);

  function openAdd(phase: TimelinePhase) {
    setActiveTask(null);
    setDefaultPhase(phase);
    setDialogOpen(true);
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Checklist"
        description="A full planning timeline, counted back from your wedding date."
        action={
          <Button onClick={() => openAdd("6_months")}>
            <Plus />
            Add task
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Overall progress
            </p>
            <p className="mt-1 font-serif text-3xl font-semibold">
              {stats.completed}
              <span className="text-muted-foreground"> / {stats.total}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.remaining} task{stats.remaining === 1 ? "" : "s"} still to
              do
            </p>
          </div>

          <div className="w-full sm:max-w-xs">
            <Progress
              value={stats.percentComplete}
              indicatorClassName="bg-sage-500"
              aria-label="Checklist completion"
            />
            <p className="mt-2 text-right text-sm font-medium text-sage-700">
              {Math.round(stats.percentComplete)}% complete
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as Filter)}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">To do</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
      </Tabs>

      <QueryState
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        skeletonRows={6}
      >
        {tasks.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Your checklist is empty"
            description="Add your first task and it will slot into the right phase of the timeline."
            action={
              <Button onClick={() => openAdd("12_months")}>
                <Plus />
                Add a task
              </Button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title={filter === "done" ? "Nothing finished yet" : "All done here"}
            description={
              filter === "done"
                ? "Tick something off and it will show up here."
                : "Every task in your checklist is complete. Enjoy the day."
            }
          />
        ) : (
          <div className="space-y-6">
            {grouped.map((phase) => (
              <Card key={phase.value}>
                <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                  <div>
                    <CardTitle className="font-serif text-xl">
                      {phase.label}
                    </CardTitle>
                    <CardDescription>{phase.description}</CardDescription>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="whitespace-nowrap rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {phase.done}/{phase.total}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`Add task to ${phase.label}`}
                      onClick={() => openAdd(phase.value)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {phase.tasks.length === 0 ? (
                    <p className="py-2 text-sm text-muted-foreground">
                      Nothing to show with this filter.
                    </p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {phase.tasks.map((task) => {
                        const overdue =
                          !task.completed &&
                          (daysUntil(task.due_date) ?? 1) < 0;

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
                              <p
                                className={cn(
                                  "text-sm font-medium transition-colors",
                                  task.completed &&
                                    "text-muted-foreground line-through",
                                )}
                              >
                                {task.title}
                              </p>
                              {task.notes ? (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {task.notes}
                                </p>
                              ) : null}
                              {task.due_date ? (
                                <p
                                  className={cn(
                                    "mt-1 flex items-center gap-1.5 text-xs",
                                    overdue
                                      ? "text-blush-600"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  <CalendarClock className="h-3.5 w-3.5" />
                                  {overdue ? "Overdue — " : ""}
                                  {formatDate(task.due_date)}
                                </p>
                              ) : null}
                            </div>

                            <RowMenu
                              label={`Actions for ${task.title}`}
                              onEdit={() => {
                                setActiveTask(task);
                                setDialogOpen(true);
                              }}
                              onDelete={() => setPendingDelete(task)}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </QueryState>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={activeTask}
        defaultPhase={defaultPhase}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Remove this task?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be deleted from your checklist.`
            : ""
        }
        confirmLabel="Remove task"
        isPending={deleteTask.isPending}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteTask.mutate(pendingDelete.id, {
            onSuccess: () => setPendingDelete(null),
          });
        }}
      />
    </div>
  );
}
