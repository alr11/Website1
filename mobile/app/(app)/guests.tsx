import * as React from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

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
import { GUEST_ROLES, GUEST_SIDES, RSVP_STATUSES } from "@/lib/constants";
import type { GuestInput } from "@/lib/hooks/use-guests";
import {
  summariseGuests,
  useCreateGuest,
  useDeleteGuest,
  useGuests,
  useUpdateGuest,
} from "@/lib/hooks/use-guests";
import { colors, fonts } from "@/lib/theme";
import type { Guest, GuestSide, RsvpStatus } from "@/lib/types";

const EMPTY: GuestInput = {
  first_name: "",
  last_name: "",
  email: null,
  phone: null,
  rsvp_status: "pending",
  party_size: 1,
  side: "both",
  role: "Guest",
  table_number: null,
  dietary_notes: null,
  notes: null,
};

const rsvpConfig = (status: RsvpStatus) =>
  RSVP_STATUSES.find((item) => item.value === status) ?? RSVP_STATUSES[0]!;

export default function GuestsScreen() {
  const { data, isPending, isError, error, refetch, isFetching } = useGuests();
  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<RsvpStatus | "all">("all");
  const [editing, setEditing] = React.useState<Guest | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [form, setForm] = React.useState<GuestInput>(EMPTY);
  const [partySize, setPartySize] = React.useState("1");

  const guests = React.useMemo(() => data ?? [], [data]);
  const stats = React.useMemo(() => summariseGuests(guests), [guests]);

  const visible = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return guests.filter((guest) => {
      if (filter !== "all" && guest.rsvp_status !== filter) return false;
      if (!term) return true;
      return [guest.first_name, guest.last_name, guest.email ?? "", guest.role ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [guests, search, filter]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setPartySize("1");
    setSheetOpen(true);
  }

  function openEdit(guest: Guest) {
    setEditing(guest);
    setForm({
      first_name: guest.first_name,
      last_name: guest.last_name,
      email: guest.email,
      phone: guest.phone,
      rsvp_status: guest.rsvp_status,
      party_size: guest.party_size,
      side: guest.side,
      role: guest.role,
      table_number: guest.table_number,
      dietary_notes: guest.dietary_notes,
      notes: guest.notes,
    });
    setPartySize(String(guest.party_size));
    setSheetOpen(true);
  }

  async function handleSubmit() {
    const payload: GuestInput = {
      ...form,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email?.trim() || null,
      phone: form.phone?.trim() || null,
      table_number: form.table_number?.trim() || null,
      dietary_notes: form.dietary_notes?.trim() || null,
      party_size: Math.max(1, Number(partySize) || 1),
    };

    if (!payload.first_name) return;

    try {
      if (editing) {
        await updateGuest.mutateAsync({ id: editing.id, ...payload });
      } else {
        await createGuest.mutateAsync(payload);
      }
      setSheetOpen(false);
    } catch {
      // The hook reports the failure as a toast.
    }
  }

  function confirmDelete(guest: Guest) {
    Alert.alert(
      "Remove this guest?",
      `${guest.first_name} ${guest.last_name} will be deleted from your guest list.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => deleteGuest.mutate(guest.id),
        },
      ],
    );
  }

  function update<K extends keyof GuestInput>(key: K, value: GuestInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <Screen
      title="Guests"
      description="Invitations, RSVPs, seating and dietary needs."
      action={<Button title="Add" onPress={openAdd} />}
      onRefresh={refetch}
      refreshing={isFetching && !isPending}
    >
      <View style={styles.grid}>
        <StatCard label="Invited" value={String(stats.invited)} hint={`${stats.households} invitations`} />
        <StatCard label="Attending" value={String(stats.attending)} hint={`${stats.maybe} deciding`} tone="sage" />
      </View>
      <View style={styles.grid}>
        <StatCard label="Awaiting" value={String(stats.pending)} hint={`${stats.declined} declined`} tone="champagne" />
        <StatCard label="Seated" value={`${stats.seated}/${stats.households}`} hint="With a table" tone="blush" />
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search by name, email or role"
        placeholderTextColor={colors.muted}
        style={styles.search}
        autoCapitalize="none"
      />

      <SelectField
        label="Filter by RSVP"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all" as const, label: "All RSVPs" },
          ...RSVP_STATUSES.map((status) => ({ value: status.value, label: status.label })),
        ]}
      />

      {isPending ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : guests.length === 0 ? (
        <EmptyState
          title="No guests yet"
          description="Add the people you know are coming, then work outwards. Party size covers plus-ones."
          action={<Button title="Add your first guest" onPress={openAdd} />}
        />
      ) : visible.length === 0 ? (
        <EmptyState title="No matches" description="Nobody matches that search or filter." />
      ) : (
        visible.map((guest) => {
          const config = rsvpConfig(guest.rsvp_status);
          return (
            <Card key={guest.id}>
              <View style={styles.rowTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>
                    {guest.first_name} {guest.last_name}
                  </Text>
                  <Text style={styles.meta}>
                    Party of {guest.party_size} ·{" "}
                    {GUEST_SIDES.find((side) => side.value === guest.side)?.label} ·{" "}
                    {guest.role ?? "Guest"}
                  </Text>
                </View>
                <Chip label={config.label} tone={config.tone} />
              </View>

              {guest.table_number || guest.dietary_notes ? (
                <Text style={styles.detail}>
                  {[
                    guest.table_number ? `Table ${guest.table_number}` : null,
                    guest.dietary_notes,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              ) : null}

              <View style={styles.actions}>
                <Button title="Edit" variant="outline" onPress={() => openEdit(guest)} style={{ flex: 1 }} />
                <Button title="Remove" variant="ghost" onPress={() => confirmDelete(guest)} style={{ flex: 1 }} />
              </View>
            </Card>
          );
        })
      )}

      <FormSheet
        visible={sheetOpen}
        title={editing ? "Edit guest" : "Add a guest"}
        description="Party size covers plus-ones and children, so head counts stay accurate."
        submitLabel={editing ? "Save changes" : "Add guest"}
        isPending={createGuest.isPending || updateGuest.isPending}
        onSubmit={handleSubmit}
        onClose={() => setSheetOpen(false)}
      >
        <TextField
          label="First name"
          value={form.first_name}
          onChangeText={(value) => update("first_name", value)}
        />
        <TextField
          label="Last name"
          value={form.last_name}
          onChangeText={(value) => update("last_name", value)}
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
        <SelectField
          label="RSVP"
          value={form.rsvp_status}
          onChange={(value) => update("rsvp_status", value as RsvpStatus)}
          options={RSVP_STATUSES.map((status) => ({ value: status.value, label: status.label }))}
        />
        <TextField
          label="Party size"
          value={partySize}
          onChangeText={setPartySize}
          keyboardType="number-pad"
        />
        <SelectField
          label="Side"
          value={form.side}
          onChange={(value) => update("side", value as GuestSide)}
          options={GUEST_SIDES.map((side) => ({ value: side.value, label: side.label }))}
        />
        <SelectField
          label="Role"
          value={(form.role ?? "Guest") as (typeof GUEST_ROLES)[number]}
          onChange={(value) => update("role", value)}
          options={GUEST_ROLES.map((role) => ({ value: role, label: role }))}
        />
        <TextField
          label="Table"
          value={form.table_number ?? ""}
          onChangeText={(value) => update("table_number", value)}
          placeholder="e.g. 4 or Head table"
        />
        <TextField
          label="Dietary needs"
          value={form.dietary_notes ?? ""}
          onChangeText={(value) => update("dietary_notes", value)}
          placeholder="Vegetarian, nut allergy…"
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
  name: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.ink },
  meta: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 3 },
  detail: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 10 },
  actions: { flexDirection: "row", gap: 8, marginTop: 14 },
});
