import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { WatchingType } from "@/types/anime-types";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

interface WatchStatusPickerProps {
  types: WatchingType[];
  selectedSlug: string | null;
  disabled: boolean;
  onSelect: (slug: string | null) => void;
}

export function WatchStatusPicker({
  types,
  selectedSlug,
  disabled,
  onSelect,
}: WatchStatusPickerProps) {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  if (types.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {types.map((type) => {
        const active = type.slug === selectedSlug;

        return (
          <Pressable
            key={type.slug}
            style={[styles.chip, active && styles.chipActive]}
            disabled={disabled}
            onPress={() => onSelect(active ? null : type.slug)}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {type.title}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    container: {
      gap: 10,
      paddingHorizontal: 16,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    chipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textMuted,
    },
    labelActive: {
      color: colors.primaryText,
    },
  });
};
