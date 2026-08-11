import * as React from "react";
import { Alert, Linking, StyleSheet, Text, TextInput, View } from "react-native";

import { Screen } from "@/components/Screen";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ErrorState,
  LoadingState,
  FormSheet,
  SelectField,
  StatCard,
  TextField,
} from "@/components/ui";
import { VENDOR_STATUSES, VENDOR_TYPES } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import type { VendorInput } from "@/lib/hooks/use-vendors";
import {
  summariseVendors,
  useCreateVendor,
  useDeleteVendor,
  useUpdateVendor,
  useVendors,
} from "@/lib/hooks/use-vendors";
import { colors, fonts } from "@/lib/theme";
import type { Vendor, VendorStatus } from "@/lib/types";

const EMPTY: VendorInput = {
  name: "",
  vendor_type: "Venue",
  contact_name: null,
  email: null,
  phone: null,
  website: null,
  estimated_cost: 0,
  deposit_paid: 0,
  status: "researching",
  notes: null,
};

const statusConfig = (status: VendorStatus) =>
  VENDOR_STATUSES.find((item) => item.value === status) ?? VENDOR_STATUSES[0]!;

export default function VendorsScreen() {
  const { data, isPending, isError, error, refetch, isFetching } = useVendors();
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();
  const deleteVendor = useDeleteVendor();

  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Vendor | null>(null);
  const [form, setForm] = React.useState<VendorInput>(EMPTY);
  const [cost, setCost] = React.useState("0");
  const [deposit, setDeposit] = React.useState("0");

  const vendors = React.useMemo(() => data ?? [], [data]);
  const stats = React.useMemo(() => summariseVendors(vendors), [vendors]);

  const usedTypes = React.useMemo(
    () => VENDOR_TYPES.filter((type) => vendors.some((vendor) => vendor.vendor_type === type)),
    [vendors],
  );

  const visible = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return vendors.filter((vendor) => {
      if (typeFilter !== "all" && vendor.vendor_type !== typeFilter) return false;
      if (!term) return true;
      return [vendor.name, vendor.contact_name ?? "", vendor.notes ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [vendors, search, typeFilter]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setCost("0");
    setDeposit("0");
    setSheetOpen(true);
  }

  function openEdit(vendor: Vendor) {
    setEditing(vendor);
    setForm({
      name: vendor.name,
      vendor_type: vendor.vendor_type,
      contact_name: vendor.contact_name,
      email: vendor.email,
      phone: vendor.phone,
      website: vendor.website,
      estimated_cost: vendor.estimated_cost,
      deposit_paid: vendor.deposit_paid,
      status: vendor.status,
      notes: vendor.notes,
    });
    setCost(String(vendor.estimated_cost));
    setDeposit(String(vendor.deposit_paid));
    setSheetOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim()) return;
    const payload: VendorInput = {
      ...form,
      name: form.name.trim(),
      contact_name: form.contact_name?.trim() || null,
      email: form.email?.trim() || null,
      phone: form.phone?.trim() || null,
      website: form.website?.trim() || null,
      notes: form.notes?.trim() || null,
      estimated_cost: Math.max(0, Number(cost) || 0),
      deposit_paid: Math.max(0, Number(deposit) || 0),
    };

    try {
      if (editing) {
        await updateVendor.mutateAsync({ id: editing.id, ...payload });
      } else {
        await createVendor.mutateAsync(payload);
      }
      setSheetOpen(false);
    } catch {
      // Reported as a toast by the hook.
    }
  }

  function confirmDelete(vendor: Vendor) {
    Alert.alert("Remove this vendor?", `${vendor.name} will be deleted.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => deleteVendor.mutate(vendor.id) },
    ]);
  }

  function update<K extends keyof VendorInput>(key: K, value: VendorInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <Screen
      title="Vendors"
      description="Quotes, contacts and deposits in one place."
      action={<Button title="Add" onPress={openAdd} />}
      onRefresh={refetch}
      refreshing={isFetching && !isPending}
    >
      <View style={styles.grid}>
        <StatCard label="Vendors" value={String(stats.total)} hint={`${usedTypes.length} categories`} />
        <StatCard label="Booked" value={String(stats.booked)} hint={`${stats.outstandingLeads} chasing`} tone="sage" />
      </View>
      <View style={styles.grid}>
        <StatCard label="Contracted" value={formatCurrency(stats.contractedCost)} tone="champagne" />
        <StatCard label="Deposits paid" value={formatCurrency(stats.depositsPaid)} tone="blush" />
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search vendors, contacts or notes"
        placeholderTextColor={colors.muted}
        style={styles.search}
        autoCapitalize="none"
      />

      {usedTypes.length > 0 ? (
        <SelectField
          label="Filter by type"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: "all", label: "All types" },
            ...usedTypes.map((type) => ({ value: type, label: type })),
          ]}
        />
      ) : null}

      {isPending ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : vendors.length === 0 ? (
        <EmptyState
          title="No vendors yet"
          description="Add the venues, caterers and photographers you're considering — even the ones you haven't contacted."
          action={<Button title="Add your first vendor" onPress={openAdd} />}
        />
      ) : visible.length === 0 ? (
        <EmptyState title="No matches" description="No vendor matches that search or filter." />
      ) : (
        visible.map((vendor) => {
          const config = statusConfig(vendor.status);
          const balance = Math.max(0, vendor.estimated_cost - vendor.deposit_paid);

          return (
            <Card key={vendor.id}>
              <View style={styles.rowTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.type}>{vendor.vendor_type.toUpperCase()}</Text>
                  <Text style={styles.name}>{vendor.name}</Text>
                </View>
                <Chip label={config.label} tone={config.tone} />
              </View>

              {vendor.contact_name ? (
                <Text style={styles.meta}>{vendor.contact_name}</Text>
              ) : null}

              {vendor.phone ? (
                <Text
                  style={styles.linkText}
                  onPress={() => Linking.openURL(`tel:${vendor.phone}`)}
                >
                  {vendor.phone}
                </Text>
              ) : null}
              {vendor.email ? (
                <Text
                  style={styles.linkText}
                  onPress={() => Linking.openURL(`mailto:${vendor.email}`)}
                >
                  {vendor.email}
                </Text>
              ) : null}

              <View style={styles.money}>
                <View>
                  <Text style={styles.meta}>Quoted</Text>
                  <Text style={styles.amount}>{formatCurrency(vendor.estimated_cost)}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.meta}>
                    {vendor.deposit_paid > 0
                      ? `${formatCurrency(vendor.deposit_paid)} deposit paid`
                      : "No deposit yet"}
                  </Text>
                  <Text style={styles.outstanding}>
                    {formatCurrency(balance)} outstanding
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Button title="Edit" variant="outline" onPress={() => openEdit(vendor)} style={{ flex: 1 }} />
                <Button title="Remove" variant="ghost" onPress={() => confirmDelete(vendor)} style={{ flex: 1 }} />
              </View>
            </Card>
          );
        })
      )}

      <FormSheet
        visible={sheetOpen}
        title={editing ? "Edit vendor" : "Add a vendor"}
        description="Keep quotes, contacts and deposits together so nothing gets chased twice."
        submitLabel={editing ? "Save changes" : "Add vendor"}
        isPending={createVendor.isPending || updateVendor.isPending}
        onSubmit={handleSubmit}
        onClose={() => setSheetOpen(false)}
      >
        <TextField
          label="Business name"
          value={form.name}
          onChangeText={(value) => update("name", value)}
          placeholder="Ivy House Barn"
        />
        <SelectField
          label="Type"
          value={form.vendor_type}
          onChange={(value) => update("vendor_type", value)}
          options={VENDOR_TYPES.map((type) => ({ value: type, label: type }))}
        />
        <SelectField
          label="Status"
          value={form.status}
          onChange={(value) => update("status", value as VendorStatus)}
          options={VENDOR_STATUSES.map((status) => ({ value: status.value, label: status.label }))}
        />
        <TextField
          label="Contact name"
          value={form.contact_name ?? ""}
          onChangeText={(value) => update("contact_name", value)}
        />
        <TextField
          label="Email"
          value={form.email ?? ""}
          onChangeText={(value) => update("email", value)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField
          label="Phone"
          value={form.phone ?? ""}
          onChangeText={(value) => update("phone", value)}
          keyboardType="phone-pad"
        />
        <TextField
          label="Quoted cost"
          value={cost}
          onChangeText={setCost}
          keyboardType="decimal-pad"
        />
        <TextField
          label="Deposit paid"
          value={deposit}
          onChangeText={setDeposit}
          keyboardType="decimal-pad"
        />
        <TextField
          label="Notes"
          value={form.notes ?? ""}
          onChangeText={(value) => update("notes", value)}
          multiline
          numberOfLines={3}
        />
      </FormSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", gap: 12 },
  search: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
  },
  rowTop: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  type: { fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 0.8, color: colors.muted },
  name: { fontFamily: fonts.serif, fontSize: 19, color: colors.ink, marginTop: 2 },
  meta: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 4 },
  linkText: { fontFamily: fonts.sans, fontSize: 13, color: colors.roseInk, marginTop: 4 },
  money: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  amount: { fontFamily: fonts.serif, fontSize: 20, color: colors.ink },
  outstanding: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink, marginTop: 2 },
  actions: { flexDirection: "row", gap: 8, marginTop: 14 },
});
