import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { WatchingType } from "@/types/anime-types";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

interface WatchingTypeTabsProps {
  types: WatchingType[];
  selectedSlug: string;
  setSelectedSlug: (slug: string) => void;
}

export function WatchingTypeTabs({
  types,
  selectedSlug,
  setSelectedSlug,
}: WatchingTypeTabsProps) {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

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
            onPress={() => setSelectedSlug(type.slug)}
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
