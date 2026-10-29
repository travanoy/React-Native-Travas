import ThemeProvider from "@/context/theme-provider";
import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

function RootNavigator() {
  const { colorScheme } = useTheme();

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="auth/sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="continue-watching" options={{ headerShown: false }} />
        <Stack.Screen name="new-episodes" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
