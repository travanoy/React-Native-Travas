import type { AnimeDetail } from "@/types/anime-types";
import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export function AnimeCard({ anime }: { anime: AnimeDetail }) {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => router.push(`/anime/${anime.id}/page`)}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: anime.coverImage }} style={styles.image} />
        <View style={styles.rating}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{anime.rating.toFixed(1)}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {anime.title}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        {anime.year} · {anime.status}
      </Text>
    </Pressable>
  );
}

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    container: {
      flex: 1,
      maxWidth: "48%",
    },
    imageWrapper: {
      marginBottom: 8,
    },
    image: {
      width: "100%",
      aspectRatio: 3 / 4,
      borderRadius: 14,
      backgroundColor: colors.surfaceAlt,
    },
    rating: {
      position: "absolute",
      top: 8,
      right: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "rgba(26, 28, 40, 0.8)",
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    ratingText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    title: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    meta: {
      fontSize: 12,
      color: colors.textMuted,
    },
    pressed: {
      opacity: 0.8,
    },
  });
};
