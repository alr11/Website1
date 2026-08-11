import * as React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { Button, Card, FormSheet, TextField } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useUpdateWeddingSettings, useWeddingSettings } from "@/lib/hooks/use-wedding";
import { colors, fonts } from "@/lib/theme";
import { toast } from "@/lib/toast";

export default function AccountScreen() {
  const { user, signOut, deleteAccount } = useAuth();
  const { data: settings } = useWeddingSettings();
  const updateSettings = useUpdateWeddingSettings();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [partnerOne, setPartnerOne] = React.useState("");
  const [partnerTwo, setPartnerTwo] = React.useState("");
  const [weddingDate, setWeddingDate] = React.useState("");
  const [venue, setVenue] = React.useState("");
  const [budget, setBudget] = React.useState("0");
  const [isDeleting, setIsDeleting] = React.useState(false);

  function openDetails() {
    if (!settings) return;
    setPartnerOne(settings.partner_one_name);
    setPartnerTwo(settings.partner_two_name);
    setWeddingDate(settings.wedding_date ?? "");
    setVenue(settings.venue_name ?? "");
    setBudget(String(settings.total_budget));
    setSheetOpen(true);
  }

  async function saveDetails() {
    try {
      await updateSettings.mutateAsync({
        partner_one_name: partnerOne.trim() || "Partner 1",
        partner_two_name: partnerTwo.trim() || "Partner 2",
        wedding_date: weddingDate.trim() || null,
        venue_name: venue.trim() || null,
        total_budget: Math.max(0, Number(budget) || 0),
      });
      setSheetOpen(false);
    } catch {
      // Reported as a toast by the hook.
    }
  }

  function confirmSignOut() {
    Alert.alert("Sign out?", "You can sign back in at any time.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", onPress: () => signOut() },
    ]);
  }

  /** Required by App Store guideline 5.1.1(v). */
  function confirmDelete() {
    Alert.alert(
      "Delete your account?",
      "Your guest list, budget, checklist and vendors will be permanently deleted. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete everything",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteAccount();
              toast.success("Your account has been deleted");
            } catch (caught) {
              toast.error(
                caught instanceof Error ? caught.message : "Could not delete the account",
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  }

  return (
    <Screen title="Account" description="Your wedding details and sign-in.">
      <Card>
        <Text style={styles.label}>SIGNED IN AS</Text>
        <Text style={styles.value}>{user?.email ?? "—"}</Text>
      </Card>

      {settings ? (
        <Card>
          <Text style={styles.label}>WEDDING</Text>
          <Text style={styles.value}>
            {settings.partner_one_name} &amp; {settings.partner_two_name}
          </Text>
          <Text style={styles.meta}>
            {settings.wedding_date ?? "No date set"}
            {settings.venue_name ? ` · ${settings.venue_name}` : ""}
          </Text>
          <Button
            title="Edit wedding details"
            variant="outline"
            onPress={openDetails}
            style={{ marginTop: 14 }}
          />
        </Card>
      ) : null}

      <Button title="Sign out" variant="outline" onPress={confirmSignOut} />

      <Card style={{ borderColor: "#e7c3c0" }}>
        <Text style={styles.label}>DANGER ZONE</Text>
        <Text style={styles.meta}>
          Deleting your account removes every guest, expense, task and vendor you have saved.
          There is no undo.
        </Text>
        <Button
          title="Delete my account"
          variant="danger"
          onPress={confirmDelete}
          loading={isDeleting}
          style={{ marginTop: 14 }}
        />
      </Card>

      <FormSheet
        visible={sheetOpen}
        title="Wedding details"
        submitLabel="Save details"
        isPending={updateSettings.isPending}
        onSubmit={saveDetails}
        onClose={() => setSheetOpen(false)}
      >
        <TextField label="Partner 1" value={partnerOne} onChangeText={setPartnerOne} />
        <TextField label="Partner 2" value={partnerTwo} onChangeText={setPartnerTwo} />
        <TextField
          label="Wedding date"
          value={weddingDate}
          onChangeText={setWeddingDate}
          placeholder="YYYY-MM-DD"
          autoCapitalize="none"
        />
        <TextField
          label="Total budget"
          value={budget}
          onChangeText={setBudget}
          keyboardType="number-pad"
        />
        <TextField label="Venue" value={venue} onChangeText={setVenue} />
      </FormSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.muted,
  },
  value: { fontFamily: fonts.serif, fontSize: 20, color: colors.ink, marginTop: 6 },
  meta: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginTop: 6, lineHeight: 18 },
});
