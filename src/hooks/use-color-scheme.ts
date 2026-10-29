import { useTheme } from "@/hooks/use-theme";

export function useColorScheme() {
  const { colorScheme } = useTheme();
  return colorScheme;
}
