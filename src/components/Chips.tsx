import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

interface ChipsProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export function Chips({ options, selected, onSelect }: ChipsProps) {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((option) => {
        const active = option === selected;

        return (
          <Pressable
            key={option}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(option)}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {option}
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
