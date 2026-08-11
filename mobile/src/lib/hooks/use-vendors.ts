import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { useUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Vendor, VendorStatus } from "@/lib/types";

import { queryKeys } from "./keys";
import { errorMessage, unwrap } from "./utils";

export interface VendorInput {
  name: string;
  vendor_type: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  estimated_cost: number;
  deposit_paid: number;
  status: VendorStatus;
  notes: string | null;
}

export function useVendors() {

  return useQuery({
    queryKey: queryKeys.vendors,
    queryFn: async () =>
      unwrap<Vendor[]>(
        await supabase
          .from("vendors")
          .select("*")
          .order("vendor_type", { ascending: true })
          .order("name", { ascending: true }),
      ),
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation({
    mutationFn: async (input: VendorInput) =>
      unwrap<Vendor>(
        await supabase
          .from("vendors")
          .insert({ ...input, user_id: user.id })
          .select()
          .single(),
      ),
    onSuccess: (vendor) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors });
      toast.success(`${vendor.name} added to your vendors`);
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not add that vendor"));
    },
  });
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<VendorInput> & { id: string }) =>
      unwrap<Vendor>(
        await supabase
          .from("vendors")
          .update(input)
          .eq("id", id)
          .select()
          .single(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors });
      toast.success("Vendor updated");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not update that vendor"));
    },
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vendors").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors });
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      toast.success("Vendor removed");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not remove that vendor"));
    },
  });
}

export function summariseVendors(vendors: Vendor[]) {
  const booked = vendors.filter((vendor) => vendor.status === "booked");

  return {
    total: vendors.length,
    booked: booked.length,
    outstandingLeads: vendors.filter(
      (vendor) => vendor.status === "researching" || vendor.status === "contacted",
    ).length,
    contractedCost: booked.reduce(
      (sum, vendor) => sum + vendor.estimated_cost,
      0,
    ),
    depositsPaid: vendors.reduce((sum, vendor) => sum + vendor.deposit_paid, 0),
  };
}
