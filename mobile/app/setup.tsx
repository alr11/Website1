import * as React from "react";
import { useRouter } from "expo-router";
import { addMonths, format } from "date-fns";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, TextField } from "@/components/ui";
import { useCreateWorkspace } from "@/lib/hooks/use-wedding";
import { colors, fonts } from "@/lib/theme";

const DEFAULT_DATE = format(addMonths(new Date(), 12), "yyyy-MM-dd");

/**
 * First run. Creates the settings row, then seeds the ten budget categories
 * and the 54-task checklist — the same seeding the web app does.
 */
export default function SetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createWorkspace = useCreateWorkspace();

  const [partnerOne, setPartnerOne] = React.useState("");
  const [partnerTwo, setPartnerTwo] = React.useState("");
  const [weddingDate, setWeddingDate] = React.useState(DEFAULT_DATE);
  const [venue, setVenue] = React.useState("");
  const [budget, setBudget] = React.useState("30000");

  async function handleSubmit() {
    try {
      await createWorkspace.mutateAsync({
        partner_one_name: partnerOne.trim() || "Partner 1",
        partner_two_name: partnerTwo.trim() || "Partner 2",
        wedding_date: weddingDate.trim() || null,
        venue_name: venue.trim() || null,
        total_budget: Number(budget) || 0,
      });
      router.replace("/(app)");
    } catch {
      // The mutation hook surfaces the error as a toast.
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.ground }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 32 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Let&rsquo;s set up your wedding</Text>
        <Text style={styles.sub}>
          Five details, and we&rsquo;ll build your checklist, split your budget into
          categories and start the countdown.
        </Text>

        <TextField
          label="Partner 1"
          value={partnerOne}
          onChangeText={setPartnerOne}
          placeholder="Alex"
        />
        <TextField
          label="Partner 2"
          value={partnerTwo}
          onChangeText={setPartnerTwo}
          placeholder="Sam"
        />
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
          placeholder="30000"
        />
        <TextField
          label="Venue (optional)"
          value={venue}
          onChangeText={setVenue}
          placeholder="Still deciding"
        />

        <Button
          title="Create my planner"
          onPress={handleSubmit}
          loading={createWorkspace.isPending}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 48 },
  heading: { fontFamily: fonts.serif, fontSize: 30, color: colors.ink },
  sub: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 20,
  },
});
