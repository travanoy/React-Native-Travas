import { AnimeCard } from "@/components/AnimeCard";
import { Chips } from "@/components/Chips";
import { EmptyState, ErrorState, LoadingState } from "@/components/StateView";
import { palette } from "@/constants/theme";
import {
  useAiringStatuses,
  useAnimeList,
  useGenres,
} from "@/hooks/use-anime";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Catalog() {
  const { colorScheme } = useTheme();
  const { t } = useLanguage();
  const styles = getStyles(colorScheme);
  const [genre, setGenre] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const { items: anime, loading, loadingMore, error, refetch, loadMore } =
    useAnimeList({
      genre: genre ?? undefined,
      status: status ?? undefined,
    });
  const { data: genreList } = useGenres();
  const { data: statusList } = useAiringStatuses();

  const allLabel = t("common.all");
  const genres = useMemo(() => [allLabel, ...(genreList ?? [])], [genreList, allLabel]);
  const statuses = useMemo(() => [allLabel, ...(statusList ?? [])], [statusList, allLabel]);

  const showReset = genre !== null || status !== null;

  const resetFilters = () => {
    setGenre(null);
    setStatus(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={anime}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onEndReached={() => void loadMore()}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <View>
            <View style={styles.filterHeader}>
              <Text style={styles.filterLabel}>{t("catalog.genres")}</Text>
              {showReset ? (
                <Pressable hitSlop={8} onPress={resetFilters}>
                  <Text style={styles.reset}>{t("catalog.reset")}</Text>
                </Pressable>
              ) : null}
            </View>
            <View style={styles.filterRow}>
              <Chips
                options={genres}
                selected={genre ?? allLabel}
                onSelect={(value) => setGenre(value === allLabel ? null : value)}
              />
            </View>

            <Text style={styles.filterLabel}>{t("catalog.status")}</Text>
            <View style={styles.filterRow}>
              <Chips
                options={statuses}
                selected={status ?? allLabel}
                onSelect={(value) => setStatus(value === allLabel ? null : value)}
              />
            </View>

            {loading ? <LoadingState label={t("catalog.loading")} /> : null}
            {error ? (
              <ErrorState message={error} onRetry={() => void refetch()} />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          loading || error ? undefined : (
            <View style={styles.emptyBody}>
              <EmptyState message={t("catalog.empty")} />
            </View>
          )
        }
        ListFooterComponent={
          loadingMore ? <LoadingState label={t("common.loadingMore")} /> : undefined
        }
        renderItem={({ item }) => <AnimeCard anime={item} />}
      />
    </SafeAreaView>
  );
}

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 30,
      gap: 18,
    },
    filterHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    filterLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 10,
    },
    reset: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.primary,
    },
    filterRow: {
      marginHorizontal: -16,
      marginBottom: 20,
    },
    row: {
      gap: 14,
    },
    emptyBody: {
      paddingTop: 40,
      alignItems: "center",
    },
  });
};
