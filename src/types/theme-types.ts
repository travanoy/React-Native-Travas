export type ThemeType = "system" | "light" | "dark";

export type ColorScheme = "light" | "dark";

export type ThemeContextType = {
  theme: ThemeType;
  colorScheme: ColorScheme;
  toggleTheme: (theme: ThemeType) => void;
};
