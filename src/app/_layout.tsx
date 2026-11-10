import { palette } from "@/constants/theme";
import AppThemeProvider from "@/context/theme-provider";
import { useTheme } from "@/hooks/use-theme";
import { setupNotificationNavigation } from "@/lib/notifications";
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider as NavigationThemeProvider,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";

function RootNavigator() {
  const { colorScheme } = useTheme();
  const colors = palette[colorScheme];

  useEffect(() => setupNotificationNavigation(), []);

  const navigationTheme = useMemo(() => {
    const baseTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.tabBar,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [colorScheme, colors]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="auth/sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="continue-watching" options={{ headerShown: false }} />
        <Stack.Screen name="new-episodes" options={{ headerShown: false }} />
        <Stack.Screen name="anime/[id]/page" options={{ headerShown: false }} />
        <Stack.Screen name="anime/[id]/watch" options={{ headerShown: false }} />
      </Stack>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootNavigator />
    </AppThemeProvider>
  );
}
