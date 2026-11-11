import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

export function StarRating({ value, onChange, size = 22 }: StarRatingProps) {
  const { colorScheme } = useTheme();
  const colors = palette[colorScheme];
  const interactive = onChange !== undefined;

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const icon = (
          <Ionicons
            name={star <= value ? "star" : "star-outline"}
            size={size}
            color={star <= value ? "#FFD700" : colors.textMuted}
          />
        );

        if (!interactive) {
          return <View key={star}>{icon}</View>;
        }

        return (
          <Pressable key={star} hitSlop={6} onPress={() => onChange(star)}>
            {icon}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 6,
  },
});
