"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useUser } from "@/components/providers";
import {
  DEFAULT_BUDGET_CATEGORIES,
  DEFAULT_TIMELINE_TASKS,
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { dueDateForPhase } from "@/lib/timeline";
import type { WeddingSettings } from "@/lib/types";

import { queryKeys } from "./keys";
import { errorMessage, unwrap, unwrapMaybe } from "./utils";

export function useWeddingSettings() {
  const supabase = createClient();

  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: async () =>
      unwrapMaybe<WeddingSettings>(
        await supabase.from("wedding_settings").select("*").maybeSingle(),
      ),
  });
}

export interface SetupInput {
  partner_one_name: string;
  partner_two_name: string;
  wedding_date: string | null;
  venue_name: string | null;
  total_budget: number;
}

/**
 * First-run setup: creates the settings row, then seeds the default budget
 * categories and the full planning checklist for the new account.
 */
export function useCreateWorkspace() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation({
    mutationFn: async (input: SetupInput) => {
      const settings = unwrap<WeddingSettings>(
        await supabase
          .from("wedding_settings")
          .upsert({ ...input, user_id: user.id })
          .select()
          .single(),
      );

      const categories = DEFAULT_BUDGET_CATEGORIES.map((category, index) => ({
        user_id: user.id,
        name: category.name,
        allocated: Math.round((input.total_budget * category.share) / 50) * 50,
        sort_order: index,
      }));

      const tasks = DEFAULT_TIMELINE_TASKS.map((task, index) => ({
        user_id: user.id,
        title: task.title,
        notes: task.notes ?? null,
        phase: task.phase,
        due_date: dueDateForPhase(input.wedding_date, task.phase),
        sort_order: index,
      }));

      const [categoryResult, taskResult] = await Promise.all([
        supabase.from("budget_categories").insert(categories),
        supabase.from("timeline_tasks").insert(tasks),
      ]);

      if (categoryResult.error) throw new Error(categoryResult.error.message);
      if (taskResult.error) throw new Error(taskResult.error.message);

      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Your wedding workspace is ready");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not finish setup"));
    },
  });
}

export function useUpdateWeddingSettings() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation({
    mutationFn: async (input: Partial<SetupInput>) =>
      unwrap<WeddingSettings>(
        await supabase
          .from("wedding_settings")
          .update(input)
          .eq("user_id", user.id)
          .select()
          .single(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
      toast.success("Wedding details updated");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not save your details"));
    },
  });
}
