import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ContinueWatchingAnime } from "@/components/mock/anime";
import { Image, StyleSheet, Text, View } from "react-native";

export function ContinueWatchingCard({ anime }: { anime: ContinueWatchingAnime }) {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  return (
    <View style={styles.container}>
      <Image source={{ uri: anime.coverImage }} style={styles.image} />
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${anime.progress * 100}%` }]} />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {anime.title}
      </Text>
      <Text style={styles.time}>
        {anime.currentTime} / {anime.totalTime}
      </Text>
    </View>
  );
}

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    container: {
      width: 140,
      marginRight: 14,
    },
    image: {
      width: 140,
      height: 190,
      borderRadius: 14,
      marginBottom: 8,
    },
    progressTrack: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.surfaceAlt,
      marginBottom: 8,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    title: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    time: {
      fontSize: 12,
      color: colors.textMuted,
    },
  });
};
