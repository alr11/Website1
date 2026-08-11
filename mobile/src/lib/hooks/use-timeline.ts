import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { useUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { TimelinePhase, TimelineTask } from "@/lib/types";

import { queryKeys } from "./keys";
import { errorMessage, unwrap } from "./utils";

export interface TaskInput {
  title: string;
  notes: string | null;
  phase: TimelinePhase;
  due_date: string | null;
}

export function useTimelineTasks() {

  return useQuery({
    queryKey: queryKeys.timeline,
    queryFn: async () =>
      unwrap<TimelineTask[]>(
        await supabase
          .from("timeline_tasks")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
      ),
  });
}

/** Optimistic so the checkbox never lags behind the click. */
export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) =>
      unwrap<TimelineTask>(
        await supabase
          .from("timeline_tasks")
          .update({
            completed,
            completed_at: completed ? new Date().toISOString() : null,
          })
          .eq("id", id)
          .select()
          .single(),
      ),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.timeline });
      const previous = queryClient.getQueryData<TimelineTask[]>(
        queryKeys.timeline,
      );

      queryClient.setQueryData<TimelineTask[]>(queryKeys.timeline, (tasks) =>
        tasks?.map((task) =>
          task.id === id
            ? {
                ...task,
                completed,
                completed_at: completed ? new Date().toISOString() : null,
              }
            : task,
        ),
      );

      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.timeline, context.previous);
      }
      toast.error(errorMessage(error, "Could not update that task"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline });
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation({
    mutationFn: async (input: TaskInput) =>
      unwrap<TimelineTask>(
        await supabase
          .from("timeline_tasks")
          .insert({ ...input, user_id: user.id, sort_order: 500 })
          .select()
          .single(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline });
      toast.success("Task added to your checklist");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not add that task"));
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<TaskInput> & { id: string }) =>
      unwrap<TimelineTask>(
        await supabase
          .from("timeline_tasks")
          .update(input)
          .eq("id", id)
          .select()
          .single(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline });
      toast.success("Task updated");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not update that task"));
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("timeline_tasks")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline });
      toast.success("Task removed");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not remove that task"));
    },
  });
}

export function summariseTasks(tasks: TimelineTask[]) {
  const completed = tasks.filter((task) => task.completed).length;

  return {
    total: tasks.length,
    completed,
    remaining: tasks.length - completed,
    percentComplete: tasks.length ? (completed / tasks.length) * 100 : 0,
  };
}
