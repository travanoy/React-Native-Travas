import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "@/hooks/use-theme";
import { ColorScheme, ThemeType } from "@/types/theme-types";
import { useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

const THEME_STORAGE_KEY = "app_theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [appTheme, setAppTheme] = useState<ThemeType>("system");
  const systemColorScheme = useSystemColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setAppTheme(stored);
      }
    });
  }, []);

  const toggleTheme = (theme: ThemeType) => {
    setAppTheme(theme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, theme).catch(() => {});
  };

  const colorScheme: ColorScheme =
    appTheme === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : appTheme;

  return (
    <ThemeContext.Provider value={{ theme: appTheme, colorScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
