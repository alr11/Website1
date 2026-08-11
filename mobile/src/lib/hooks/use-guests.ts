import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { useUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Guest, GuestSide, RsvpStatus } from "@/lib/types";

import { queryKeys } from "./keys";
import { errorMessage, unwrap } from "./utils";

export interface GuestInput {
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  rsvp_status: RsvpStatus;
  party_size: number;
  side: GuestSide;
  role: string | null;
  table_number: string | null;
  dietary_notes: string | null;
  notes: string | null;
}

export function useGuests() {

  return useQuery({
    queryKey: queryKeys.guests,
    queryFn: async () =>
      unwrap<Guest[]>(
        await supabase
          .from("guests")
          .select("*")
          .order("last_name", { ascending: true })
          .order("first_name", { ascending: true }),
      ),
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation({
    mutationFn: async (input: GuestInput) =>
      unwrap<Guest>(
        await supabase
          .from("guests")
          .insert({ ...input, user_id: user.id })
          .select()
          .single(),
      ),
    onSuccess: (guest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests });
      toast.success(`${guest.first_name} added to the guest list`);
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not add that guest"));
    },
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<GuestInput> & { id: string }) =>
      unwrap<Guest>(
        await supabase
          .from("guests")
          .update(input)
          .eq("id", id)
          .select()
          .single(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests });
      toast.success("Guest updated");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not update that guest"));
    },
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("guests").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests });
      toast.success("Guest removed");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not remove that guest"));
    },
  });
}

export interface GuestStats {
  households: number;
  invited: number;
  attending: number;
  declined: number;
  maybe: number;
  pending: number;
  seated: number;
}

/** Head counts respect `party_size`, so "+1"s are counted properly. */
export function summariseGuests(guests: Guest[]): GuestStats {
  const totalFor = (status: RsvpStatus) =>
    guests
      .filter((guest) => guest.rsvp_status === status)
      .reduce((sum, guest) => sum + guest.party_size, 0);

  return {
    households: guests.length,
    invited: guests.reduce((sum, guest) => sum + guest.party_size, 0),
    attending: totalFor("yes"),
    declined: totalFor("no"),
    maybe: totalFor("maybe"),
    pending: totalFor("pending"),
    seated: guests.filter((guest) => Boolean(guest.table_number)).length,
  };
}
