import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { NewEpisodeAnime } from "@/components/mock/anime";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text } from "react-native";

export function NewEpisodeCard({ anime }: { anime: NewEpisodeAnime }) {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => router.push(`/anime/${anime.id}/page`)}
    >
      <Image source={{ uri: anime.coverImage }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>
        {anime.title}
      </Text>
    </Pressable>
  );
}

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    container: {
      width: 160,
    },
    image: {
      width: 160,
      height: 100,
      borderRadius: 14,
      marginBottom: 8,
    },
    title: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    pressed: {
      opacity: 0.8,
    },
  });
};
