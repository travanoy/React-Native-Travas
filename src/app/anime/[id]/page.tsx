import { getAnimeById } from "@/components/mock/anime";
import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const goBack = () =>
  router.canGoBack() ? router.back() : router.replace("/(tabs)/home");

export default function AnimeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useTheme();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);
  const { bottom } = useSafeAreaInsets();

  const anime = getAnimeById(id);

  if (!anime) {
    return (
      <SafeAreaView style={[styles.screen, styles.notFound]}>
        <Text style={styles.notFoundText}>Anime not found</Text>
        <Pressable onPress={goBack} hitSlop={8}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 24 }]}
      >
        <View style={styles.hero}>
          <Image source={{ uri: anime.coverImage }} style={styles.image} resizeMode="cover" />
          <View style={styles.overlay} />

          <SafeAreaView edges={["top"]} style={styles.heroTop}>
            <Pressable onPress={goBack} hitSlop={12} style={styles.back}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{anime.rating.toFixed(1)}</Text>
            </View>
          </SafeAreaView>

          <View style={styles.heroInfo}>
            <Text style={styles.title}>{anime.title}</Text>
            {anime.englishTitle !== anime.title && (
              <Text style={styles.englishTitle}>{anime.englishTitle}</Text>
            )}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{anime.year}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.meta}>{anime.status}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.meta}>{anime.episodes} episodes</Text>
          </View>

          <View style={styles.genres}>
            {anime.genres.map((genre) => (
              <View key={genre} style={styles.genreChip}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.description}>{anime.description}</Text>

          <Pressable
            style={({ pressed }) => [styles.watchButton, pressed && styles.pressed]}
            onPress={() => Alert.alert("Watch", `${anime.title} — episode 1`)}
          >
            <Ionicons name="play" size={18} color={colors.primaryText} />
            <Text style={styles.watchText}>Watch now</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingBottom: 24,
    },
    hero: {
      height: 340,
      marginBottom: 20,
      overflow: "hidden",
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(13, 14, 21, 0.5)",
    },
    heroTop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    back: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(13, 14, 21, 0.55)",
    },
    rating: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(13, 14, 21, 0.7)",
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    ratingText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    heroInfo: {
      position: "absolute",
      left: 16,
      right: 16,
      bottom: 20,
    },
    title: {
      fontSize: 30,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    englishTitle: {
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.75)",
      marginTop: 4,
    },
    body: {
      paddingHorizontal: 16,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 14,
    },
    meta: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textMuted,
    },
    metaDot: {
      fontSize: 14,
      color: colors.textMuted,
    },
    genres: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 22,
    },
    genreChip: {
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    genreText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 15,
      lineHeight: 23,
      color: colors.text,
      marginBottom: 24,
    },
    watchButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 16,
      paddingVertical: 16,
      backgroundColor: colors.primary,
    },
    watchText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.primaryText,
    },
    pressed: {
      opacity: 0.85,
    },
    notFound: {
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    notFoundText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    link: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.primary,
    },
  });
};
