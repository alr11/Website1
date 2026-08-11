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
import { toast } from "@/lib/toast";

export default function SignInScreen() {
  const { signIn, sendPasswordReset } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  async function handleSignIn() {
    setError(null);
    setIsPending(true);
    try {
      await signIn(email, password);
      // The root layout redirects once the session lands.
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign in.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleReset() {
    if (!email.trim()) {
      setError("Enter your email address first, then tap reset.");
      return;
    }
    try {
      await sendPasswordReset(email);
      toast.success("Password reset email sent");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send the reset email.");
    }
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
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.sub}>Sign in to pick up where you left off.</Text>

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
            autoComplete="current-password"
            placeholder="Your password"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button title="Sign in" onPress={handleSignIn} loading={isPending} />

          <Button
            title="Forgot your password?"
            variant="ghost"
            onPress={handleReset}
            style={{ marginTop: 8 }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>No account yet? </Text>
          <Link href="/(auth)/sign-up" style={styles.link}>
            Create one
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
  sub: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, marginTop: 6 },
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
