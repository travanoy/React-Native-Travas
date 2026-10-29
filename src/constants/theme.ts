import { ColorScheme } from "@/types/theme-types";

export const palette = {
  light: {
    background: "#F5F6FA",
    surface: "#FFFFFF",
    surfaceAlt: "#ECEEF5",
    border: "#E2E4EC",
    text: "#0D0E15",
    textMuted: "#6B6E80",
    primary: "#6B52FA",
    primaryText: "#FFFFFF",
    danger: "#E5484D",
    tabBar: "#FFFFFF",
    overlay: "rgba(13, 14, 21, 0.25)",
  },
  dark: {
    background: "#0D0E15",
    surface: "#1A1C28",
    surfaceAlt: "#1C1C24",
    border: "#1C1C24",
    text: "#FFFFFF",
    textMuted: "#8A8D9F",
    primary: "#6B52FA",
    primaryText: "#FFFFFF",
    danger: "#E5484D",
    tabBar: "#15161F",
    overlay: "rgba(13, 14, 21, 0.4)",
  },
} as const;

export type AppColors = (typeof palette)[ColorScheme];
