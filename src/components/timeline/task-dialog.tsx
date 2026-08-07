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
import { TIMELINE_PHASES } from "@/lib/constants";
import type { TaskInput } from "@/lib/hooks/use-timeline";
import { useCreateTask, useUpdateTask } from "@/lib/hooks/use-timeline";
import { useWeddingSettings } from "@/lib/hooks/use-wedding";
import { dueDateForPhase } from "@/lib/timeline";
import type { TimelinePhase, TimelineTask } from "@/lib/types";

export function TaskDialog({
  open,
  onOpenChange,
  task,
  defaultPhase = "6_months",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TimelineTask | null;
  defaultPhase?: TimelinePhase;
}) {
  const { data: settings } = useWeddingSettings();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const [form, setForm] = React.useState<TaskInput>({
    title: "",
    notes: null,
    phase: defaultPhase,
    due_date: null,
  });

  React.useEffect(() => {
    if (!open) return;

    if (task) {
      setForm({
        title: task.title,
        notes: task.notes,
        phase: task.phase,
        due_date: task.due_date,
      });
    } else {
      setForm({
        title: "",
        notes: null,
        phase: defaultPhase,
        due_date: dueDateForPhase(settings?.wedding_date, defaultPhase),
      });
    }
  }, [open, task, defaultPhase, settings?.wedding_date]);

  const isPending = createTask.isPending || updateTask.isPending;

  /** Changing the phase re-suggests a due date, unless one was typed already. */
  function changePhase(phase: TimelinePhase) {
    setForm((current) => ({
      ...current,
      phase,
      due_date: task
        ? current.due_date
        : dueDateForPhase(settings?.wedding_date, phase),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: TaskInput = {
      ...form,
      title: form.title.trim(),
      notes: form.notes?.trim() || null,
    };

    try {
      if (task) {
        await updateTask.mutateAsync({ id: task.id, ...payload });
      } else {
        await createTask.mutateAsync(payload);
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
          <DialogTitle>{task ? "Edit task" : "Add a task"}</DialogTitle>
          <DialogDescription>
            Tasks sit inside a phase of the timeline, counted back from your
            wedding date.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task_title">Task</Label>
            <Input
              id="task_title"
              required
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Book the string quartet"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task_phase">Phase</Label>
              <Select
                value={form.phase}
                onValueChange={(value) => changePhase(value as TimelinePhase)}
              >
                <SelectTrigger id="task_phase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_PHASES.map((phase) => (
                    <SelectItem key={phase.value} value={phase.value}>
                      {phase.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task_due_date">Due date</Label>
              <Input
                id="task_due_date"
                type="date"
                value={form.due_date ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    due_date: event.target.value || null,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task_notes">Notes</Label>
            <Textarea
              id="task_notes"
              rows={3}
              value={form.notes ?? ""}
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
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
              {task ? "Save changes" : "Add task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
