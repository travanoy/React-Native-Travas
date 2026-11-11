import { palette } from "@/constants/theme";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const router = useRouter();
  const { colorScheme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);
  const isDark = colorScheme === "dark";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t("settings.title")}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.appearance")}</Text>

        <View style={styles.option}>
          <View style={styles.optionLeft}>
            <Ionicons
              name={isDark ? "moon-outline" : "sunny-outline"}
              size={20}
              color={colors.text}
            />
            <Text style={styles.optionLabel}>
              {isDark ? t("profile.darkTheme") : t("profile.lightTheme")}
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={(value) => toggleTheme(value ? "dark" : "light")}
            trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
            thumbColor={colors.switchThumb}
            ios_backgroundColor={colors.switchTrackOff}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.language")}</Text>

        <View style={styles.langRow}>
          {(["en", "ru"] as const).map((lang) => {
            const active = lang === language;

            return (
              <Pressable
                key={lang}
                style={[styles.langButton, active && styles.langButtonActive]}
                onPress={() => setLanguage(lang)}
              >
                <Text
                  style={[
                    styles.langButtonText,
                    active && styles.langButtonTextActive,
                  ]}
                >
                  {lang === "en" ? "English" : "Русский"}
                </Text>
              </Pressable>
            );
          })}
        </View>
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
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    section: {
      paddingHorizontal: 16,
      gap: 10,
      marginBottom: 28,
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
    langRow: {
      flexDirection: "row",
      gap: 10,
    },
    langButton: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    langButtonActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    langButtonText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textMuted,
    },
    langButtonTextActive: {
      color: colors.primaryText,
    },
  });
};
