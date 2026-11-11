import { ErrorState, LoadingState } from "@/components/StateView";
import { ReviewsSection } from "@/components/ReviewsSection";
import { WatchStatusPicker } from "@/components/WatchStatusPicker";
import { savedApi } from "@/api/saved.api";
import { palette } from "@/constants/theme";
import { useWatchStatuses } from "@/hooks/use-collections";
import { useAnimeDetail } from "@/hooks/use-anime";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const goBack = () =>
  router.canGoBack() ? router.back() : router.replace("/(tabs)/home");

export default function AnimeDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { colorScheme } = useTheme();
  const { t } = useLanguage();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);
  const { bottom } = useSafeAreaInsets();

  const { data: anime, loading, error, refetch } = useAnimeDetail(id ?? "");

  const { data: watchTypes } = useWatchStatuses();
  const [statusSlug, setStatusSlug] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatusSlug(anime?.watchStatusSlug ?? null);
  }, [anime?.watchStatusSlug]);

  const changeWatchStatus = async (slug: string | null) => {
    if (!anime || savingStatus) {
      return;
    }

    setSavingStatus(true);
    const previous = statusSlug;
    setStatusSlug(slug);

    try {
      if (slug) {
        const updated = await savedApi.setWatchStatus(anime.id, slug);
        setStatusSlug(updated.watchStatusSlug ?? null);
      } else {
        await savedApi.removeWatchStatus(anime.id);
        setStatusSlug(null);
      }
    } catch (cause) {
      setStatusSlug(previous);
      Alert.alert(
        t("common.error"),
        cause instanceof Error ? cause.message : t("anime.updateError"),
      );
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading && !anime) {
    return (
      <SafeAreaView style={[styles.screen, styles.centered]}>
        <LoadingState label={t("anime.loading")} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.screen, styles.centered]}>
        <ErrorState message={error} onRetry={() => void refetch()} />
        <Pressable onPress={goBack} hitSlop={8}>
          <Text style={styles.link}>{t("common.goBack")}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!anime) {
    return (
      <SafeAreaView style={[styles.screen, styles.centered]}>
        <Text style={styles.notFoundText}>{t("anime.notFound")}</Text>
        <Pressable onPress={goBack} hitSlop={8}>
          <Text style={styles.link}>{t("common.goBack")}</Text>
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
            <Text style={styles.meta}>{t("anime.episodes", { n: anime.episodes })}</Text>
          </View>

          <View style={styles.genres}>
            {anime.genres.map((genre) => (
              <View key={genre} style={styles.genreChip}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{t("anime.myList")}</Text>
          <View style={styles.pickerWrapper}>
            <WatchStatusPicker
              types={watchTypes ?? []}
              selectedSlug={statusSlug}
              disabled={savingStatus}
              onSelect={(slug) => void changeWatchStatus(slug)}
            />
          </View>

          <Text style={styles.sectionTitle}>{t("anime.synopsis")}</Text>
          <Text style={styles.description}>{anime.description}</Text>

          <Pressable
            style={({ pressed }) => [styles.watchButton, pressed && styles.pressed]}
            onPress={() =>
              router.push({
                pathname: "/anime/[id]/watch",
                params: { id: anime.id, shikimoriId: String(anime.shikimoriId) },
              })
            }
          >
            <Ionicons name="play" size={18} color={colors.primaryText} />
            <Text style={styles.watchText}>{t("anime.watchNow")}</Text>
          </Pressable>

          <ReviewsSection animeId={anime.id} />
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
    centered: {
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
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
    pickerWrapper: {
      marginHorizontal: -16,
      marginBottom: 22,
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
