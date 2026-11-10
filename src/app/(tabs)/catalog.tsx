import { AnimeCard } from "@/components/AnimeCard";
import { Chips } from "@/components/Chips";
import { EmptyState, ErrorState, LoadingState } from "@/components/StateView";
import { palette } from "@/constants/theme";
import {
  useAiringStatuses,
  useAnimeList,
  useGenres,
} from "@/hooks/use-anime";
import { useTheme } from "@/hooks/use-theme";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Catalog() {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);
  const [genre, setGenre] = useState("All");
  const [status, setStatus] = useState("All");

  const { items: anime, loading, loadingMore, error, refetch, loadMore } =
    useAnimeList({
      genre: genre === "All" ? undefined : genre,
      status: status === "All" ? undefined : status,
    });
  const { data: genreList } = useGenres();
  const { data: statusList } = useAiringStatuses();

  const genres = useMemo(() => ["All", ...(genreList ?? [])], [genreList]);
  const statuses = useMemo(() => ["All", ...(statusList ?? [])], [statusList]);

  const showReset = genre !== "All" || status !== "All";

  const resetFilters = () => {
    setGenre("All");
    setStatus("All");
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
              <Text style={styles.filterLabel}>Genres</Text>
              {showReset ? (
                <Pressable hitSlop={8} onPress={resetFilters}>
                  <Text style={styles.reset}>Reset</Text>
                </Pressable>
              ) : null}
            </View>
            <View style={styles.filterRow}>
              <Chips options={genres} selected={genre} onSelect={setGenre} />
            </View>

            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.filterRow}>
              <Chips options={statuses} selected={status} onSelect={setStatus} />
            </View>

            {loading ? <LoadingState label="Loading catalog..." /> : null}
            {error ? (
              <ErrorState message={error} onRetry={() => void refetch()} />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          loading || error ? undefined : (
            <View style={styles.emptyBody}>
              <EmptyState message="Nothing matches these filters" />
            </View>
          )
        }
        ListFooterComponent={
          loadingMore ? <LoadingState label="Loading more..." /> : undefined
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
