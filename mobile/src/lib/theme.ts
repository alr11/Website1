/**
 * The same palette and type scale as the web app, expressed as plain values
 * for React Native's StyleSheet. Kept deliberately in sync with
 * `src/app/globals.css` and `tailwind.config.ts` in the web project.
 */

export const colors = {
  ground: "#fbf9f6",
  card: "#ffffff",
  ink: "#372e29",
  muted: "#7c736b",
  border: "#e8e1d9",

  rose: "#bc4a68",
  roseInk: "#9b3151",
  roseTint: "#fbe9ec",
  roseLine: "#f6d3da",

  sage: "#658257",
  sageInk: "#3f5237",
  sageTint: "#e7ede4",
  sageLine: "#cfdac9",

  champagne: "#d5a044",
  champagneInk: "#9c672c",
  champagneTint: "#faf2e0",
  champagneLine: "#f4e4bf",

  neutralTint: "#f4efe9",
  accentTint: "#fdf0f3",
  danger: "#b3261e",
  white: "#ffffff",
} as const;

export type ToneName = "neutral" | "sage" | "champagne" | "blush";

/** Background / border / text triple for a status chip or stat badge. */
export const tones: Record<
  ToneName,
  { bg: string; border: string; text: string; solid: string }
> = {
  neutral: {
    bg: colors.neutralTint,
    border: colors.border,
    text: colors.muted,
    solid: "#cdc4bb",
  },
  sage: {
    bg: colors.sageTint,
    border: colors.sageLine,
    text: colors.sageInk,
    solid: colors.sage,
  },
  champagne: {
    bg: colors.champagneTint,
    border: colors.champagneLine,
    text: colors.champagneInk,
    solid: colors.champagne,
  },
  blush: {
    bg: colors.roseTint,
    border: colors.roseLine,
    text: colors.roseInk,
    solid: colors.rose,
  },
};

export const fonts = {
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemibold: "Inter_600SemiBold",
  serif: "CormorantGaramond_600SemiBold",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  pill: 999,
} as const;

/** Matches the web app's `shadow-sm` closely enough on both platforms. */
export const cardShadow = {
  shadowColor: "#372e29",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;
