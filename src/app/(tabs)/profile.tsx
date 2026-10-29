import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const THEME_OPTIONS: { value: ThemeType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "system", label: "System", icon: "phone-portrait-outline" },
  { value: "light", label: "Light", icon: "sunny-outline" },
  { value: "dark", label: "Dark", icon: "moon-outline" },
];

export default function Profile() {
  const { theme, colorScheme, toggleTheme } = useTheme();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>

        {THEME_OPTIONS.map((option) => {
          const isActive = theme === option.value;

          return (
            <Pressable
              key={option.value}
              style={[styles.option, isActive && styles.optionActive]}
              onPress={() => toggleTheme(option.value)}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={option.icon} size={20} color={colors.text} />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </View>

              {isActive && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
    },
    section: {
      paddingHorizontal: 16,
      gap: 10,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textMuted,
      marginBottom: 4,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionActive: {
      borderColor: colors.primary,
    },
    optionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    optionLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
  });
};
