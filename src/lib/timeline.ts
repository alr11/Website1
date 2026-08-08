import { addDays, addMonths, format, isValid, parseISO } from "date-fns";

import { TIMELINE_PHASES } from "@/lib/constants";
import type { TimelinePhase, TimelineTask } from "@/lib/types";

/**
 * Derives a due date for a checklist phase from the wedding date.
 * `1 week out` is a quarter-month, `after` sits a month past the wedding.
 */
export function dueDateForPhase(
  weddingDate: string | null | undefined,
  phase: TimelinePhase,
): string | null {
  if (!weddingDate) return null;

  const day = parseISO(weddingDate);
  if (!isValid(day)) return null;

  const config = TIMELINE_PHASES.find((item) => item.value === phase);
  if (!config) return null;

  if (config.monthsBefore === 0.25) return format(addDays(day, -7), "yyyy-MM-dd");
  if (config.monthsBefore === -1) return format(addMonths(day, 1), "yyyy-MM-dd");

  return format(addMonths(day, -config.monthsBefore), "yyyy-MM-dd");
}

export function phaseIndex(phase: TimelinePhase) {
  const index = TIMELINE_PHASES.findIndex((item) => item.value === phase);
  return index === -1 ? TIMELINE_PHASES.length : index;
}

/** Chronological order: phase first, then the task's own position in the phase. */
export function compareTasks(a: TimelineTask, b: TimelineTask) {
  const byPhase = phaseIndex(a.phase) - phaseIndex(b.phase);
  if (byPhase !== 0) return byPhase;
  return a.sort_order - b.sort_order;
}

/** The next few open tasks, earliest phase first — powers the dashboard. */
export function upcomingTasks(tasks: TimelineTask[], limit = 5) {
  return tasks
    .filter((task) => !task.completed)
    .sort(compareTasks)
    .slice(0, limit);
}
