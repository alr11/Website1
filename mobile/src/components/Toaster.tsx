import * as React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts, radius, cardShadow } from "@/lib/theme";
import { subscribeToToasts, type ToastMessage } from "@/lib/toast";

/** Renders the toasts emitted by the data hooks. */
export function Toaster() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = React.useState<ToastMessage[]>([]);

  React.useEffect(
    () =>
      subscribeToToasts((message) => {
        setMessages((current) => [...current, message]);
        setTimeout(() => {
          setMessages((current) => current.filter((item) => item.id !== message.id));
        }, 2800);
      }),
    [],
  );

  if (messages.length === 0) return null;

  return (
    <View pointerEvents="none" style={[styles.wrap, { bottom: insets.bottom + 76 }]}>
      {messages.map((message) => (
        <Toast key={message.id} message={message} />
      ))}
    </View>
  );
}

function Toast({ message }: { message: ToastMessage }) {
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const isError = message.tone === "error";

  return (
    <Animated.View
      style={[
        styles.toast,
        { opacity },
        isError && { borderColor: "#e7c3c0", backgroundColor: "#fdf3f2" },
      ]}
    >
      <Text style={[styles.text, isError && { color: colors.danger }]}>
        {message.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16, gap: 8 },
  toast: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...cardShadow,
  },
  text: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink },
});
