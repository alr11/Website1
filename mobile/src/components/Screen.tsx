import * as React from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts } from "@/lib/theme";

/** Scrolling page shell with the standard header and pull-to-refresh. */
export function Screen({
  title,
  description,
  action,
  onRefresh,
  refreshing,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.ground }}
      contentContainerStyle={{
        padding: 16,
        paddingTop: insets.top + 12,
        paddingBottom: 32,
        gap: 16,
      }}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh
          ? <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} tintColor={colors.rose} />
          : undefined
      }
    >
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
        {action}
      </View>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "flex-end", gap: 12 },
  title: { fontFamily: fonts.serif, fontSize: 30, color: colors.ink },
  description: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
    lineHeight: 18,
  },
});
