import * as React from "react";
import { Link } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, TextField } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { colors, fonts } from "@/lib/theme";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  async function handleSignUp() {
    setError(null);
    setIsPending(true);
    try {
      const { needsConfirmation: pending } = await signUp(email, password);
      if (pending) setNeedsConfirmation(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create the account.");
    } finally {
      setIsPending(false);
    }
  }

  if (needsConfirmation) {
    return (
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 64 }]}>
        <Text style={styles.heading}>Check your inbox</Text>
        <Text style={styles.sub}>
          We sent a confirmation link to {email}. Confirm your address, then sign in.
        </Text>
        <Link href="/(auth)/sign-in" style={[styles.link, { marginTop: 24 }]}>
          Back to sign in
        </Link>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.ground }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 48 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.wordmark}>Everly</Text>
        <Text style={styles.heading}>Start planning</Text>
        <Text style={styles.sub}>Create an account — it takes about ten seconds.</Text>

        <View style={{ marginTop: 28 }}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="you@example.com"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
            placeholder="At least 6 characters"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button title="Create account" onPress={handleSignUp} loading={isPending} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already planning? </Text>
          <Link href="/(auth)/sign-in" style={styles.link}>
            Sign in
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 48 },
  wordmark: { fontFamily: fonts.serif, fontSize: 22, color: colors.rose },
  heading: { fontFamily: fonts.serif, fontSize: 34, color: colors.ink, marginTop: 24 },
  sub: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    marginTop: 6,
    lineHeight: 20,
  },
  error: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.danger,
    marginBottom: 12,
    lineHeight: 18,
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
  footerText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted },
  link: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.rose },
});
