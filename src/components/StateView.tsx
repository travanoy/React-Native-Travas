import { palette } from "@/constants/theme";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label }: LoadingStateProps) {
  const { t } = useLanguage();
  const { colorScheme } = useTheme();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.message}>{label ?? t("common.loading")}</Text>
    </View>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useLanguage();
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={onRetry}
        >
          <Text style={styles.buttonText}>{t("common.retry")}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      paddingVertical: 32,
      paddingHorizontal: 24,
    },
    message: {
      fontSize: 15,
      color: colors.textMuted,
      textAlign: "center",
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.primary,
    },
    pressed: {
      opacity: 0.85,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primaryText,
    },
  });
};
