import * as React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { cardShadow, colors, fonts, radius, tones, type ToneName } from "@/lib/theme";

/* -------------------------------------------------------------------------- */
/* Type                                                                       */
/* -------------------------------------------------------------------------- */

export function Title({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Display({ children }: { children: React.ReactNode }) {
  return <Text style={styles.display}>{children}</Text>;
}

export function Body({
  children,
  muted,
  style,
}: {
  children: React.ReactNode;
  muted?: boolean;
  style?: object;
}) {
  return (
    <Text style={[styles.body, muted && { color: colors.muted }, style]}>
      {children}
    </Text>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Chip({ label, tone = "neutral" }: { label: string; tone?: ToneName }) {
  const t = tones[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg, borderColor: t.border }]}>
      <Text style={[styles.chipText, { color: t.text }]}>{label}</Text>
    </View>
  );
}

export function ProgressBar({
  value,
  tone = "sage",
  height = 8,
}: {
  /** 0–100. */
  value: number;
  tone?: ToneName;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      <View
        style={{
          width: `${clamped}%`,
          height: "100%",
          borderRadius: height,
          backgroundColor: tones[tone].solid,
        }}
      />
    </View>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "blush",
  progress,
  progressTone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: ToneName;
  progress?: number;
  progressTone?: ToneName;
}) {
  return (
    <Card style={styles.stat}>
      <View style={styles.statTop}>
        <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
        <View style={[styles.statDot, { backgroundColor: tones[tone].bg }]} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {progress !== undefined ? (
        <View style={{ marginTop: 12 }}>
          <ProgressBar value={progress} tone={progressTone ?? tone} />
        </View>
      ) : null}
      {hint ? <Text style={styles.statHint}>{hint}</Text> : null}
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{description}</Text>
      {action ? <View style={{ marginTop: 16 }}>{action}</View> : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Controls                                                                   */
/* -------------------------------------------------------------------------- */

export function Button({
  title,
  onPress,
  variant = "primary",
  loading,
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const isDisabled = disabled || loading;
  const palette = {
    primary: { bg: colors.rose, fg: colors.white, border: colors.rose },
    outline: { bg: colors.card, fg: colors.ink, border: colors.border },
    ghost: { bg: "transparent", fg: colors.muted, border: "transparent" },
    danger: { bg: colors.danger, fg: colors.white, border: colors.danger },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(isDisabled) }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: isDisabled ? 0.55 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.fg} />
      ) : (
        <Text style={[styles.buttonText, { color: palette.fg }]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Checkbox({
  checked,
  onToggle,
  accessibilityLabel,
}: {
  checked: boolean;
  onToggle: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      onPress={onToggle}
      hitSlop={8}
      style={[
        styles.checkbox,
        checked && { backgroundColor: colors.sage, borderColor: colors.sage },
      ]}
    >
      {checked ? <Text style={styles.checkmark}>✓</Text> : null}
    </Pressable>
  );
}

export function TextField({
  label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Label>{label}</Label>
      <TextInput
        placeholderTextColor={colors.muted}
        {...props}
        style={[styles.input, props.multiline && styles.inputMultiline]}
      />
    </View>
  );
}

/** React Native has no native select, so this opens a sheet of options. */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const current = options.find((option) => option.value === value);

  return (
    <View style={{ marginBottom: 16 }}>
      <Label>{label}</Label>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        style={styles.input}
      >
        <Text style={styles.selectText}>{current?.label ?? "Choose…"}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.scrim} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <ScrollView style={{ maxHeight: 360 }}>
              {options.map((option) => {
                const selected = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    style={[styles.option, selected && { backgroundColor: colors.accentTint }]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && { color: colors.roseInk, fontFamily: fonts.sansMedium },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Modal form                                                                 */
/* -------------------------------------------------------------------------- */

export function FormSheet({
  visible,
  title,
  description,
  submitLabel,
  onSubmit,
  onClose,
  isPending,
  destructive,
  children,
}: {
  visible: boolean;
  title: string;
  description?: string;
  submitLabel: string;
  onSubmit: () => void;
  onClose: () => void;
  isPending?: boolean;
  destructive?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <View style={styles.dialog}>
          <Text style={styles.dialogTitle}>{title}</Text>
          {description ? <Text style={styles.dialogBody}>{description}</Text> : null}

          {children ? (
            <ScrollView style={{ maxHeight: 420 }} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>
          ) : null}

          <View style={styles.dialogFooter}>
            <Button title="Cancel" variant="outline" onPress={onClose} style={{ flex: 1 }} />
            <Button
              title={submitLabel}
              variant={destructive ? "danger" : "primary"}
              onPress={onSubmit}
              loading={isPending}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/* Query states                                                               */
/* -------------------------------------------------------------------------- */

export function LoadingState() {
  return (
    <View style={styles.centered}>
      <ActivityIndicator color={colors.rose} />
    </View>
  );
}

export function ErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorTitle}>We couldn&rsquo;t load this</Text>
      <Text style={styles.errorBody}>
        {error instanceof Error ? error.message : "Something went wrong."}
      </Text>
      <Button title="Try again" variant="outline" onPress={onRetry} style={{ marginTop: 12 }} />
    </View>
  );
}

/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.ink },
  display: { fontFamily: fonts.serif, fontSize: 34, color: colors.ink },
  body: { fontFamily: fonts.sans, fontSize: 14, color: colors.ink, lineHeight: 20 },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink,
    marginBottom: 6,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...cardShadow,
  },

  chip: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 12 },

  track: { width: "100%", backgroundColor: "#f0ebe4", overflow: "hidden" },

  stat: { flex: 1, minWidth: 150 },
  statTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.muted,
    flexShrink: 1,
  },
  statDot: { width: 26, height: 26, borderRadius: 13 },
  statValue: { fontFamily: fonts.serif, fontSize: 28, color: colors.ink, marginTop: 6 },
  statHint: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 10 },

  empty: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: radius.lg,
    padding: 28,
    alignItems: "center",
    backgroundColor: colors.card,
  },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 19, color: colors.ink, marginBottom: 6 },
  emptyBody: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },

  button: {
    height: 46,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  buttonText: { fontFamily: fonts.sansMedium, fontSize: 15 },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: { color: colors.white, fontSize: 13, fontWeight: "700", lineHeight: 16 },

  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    justifyContent: "center",
  },
  inputMultiline: { minHeight: 88, textAlignVertical: "top" },
  selectText: { fontFamily: fonts.sans, fontSize: 15, color: colors.ink },

  scrim: {
    flex: 1,
    backgroundColor: "rgba(55,46,41,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  sheet: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
  },
  sheetTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.ink,
    marginBottom: 8,
  },
  option: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: radius.sm },
  optionText: { fontFamily: fonts.sans, fontSize: 15, color: colors.ink },

  dialog: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 20 },
  dialogTitle: { fontFamily: fonts.serif, fontSize: 22, color: colors.ink },
  dialogBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 18,
  },
  dialogFooter: { flexDirection: "row", gap: 8, marginTop: 16 },

  centered: { paddingVertical: 48, alignItems: "center" },
  errorBox: {
    borderWidth: 1,
    borderColor: "#e7c3c0",
    backgroundColor: "#fdf3f2",
    borderRadius: radius.lg,
    padding: 20,
    alignItems: "center",
  },
  errorTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.ink },
  errorBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    marginTop: 6,
  },
});
