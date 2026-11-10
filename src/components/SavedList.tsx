import { AnimeCard } from "@/components/AnimeCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/StateView";
import type { AnimeDetail } from "@/types/anime-types";
import { FlatList, StyleSheet, View } from "react-native";

interface SavedListProps {
  anime: AnimeDetail[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  onRetry: () => void;
  onEndReached: () => void;
}

export function SavedList({
  anime,
  loading,
  loadingMore,
  error,
  onRetry,
  onEndReached,
}: SavedListProps) {
  const styles = getStyles();

  if (loading && anime.length === 0) {
    return <LoadingState label="Loading saved..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  return (
    <FlatList
      data={anime}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      ListEmptyComponent={
        <View style={styles.emptyBody}>
          <EmptyState message="Nothing in this list yet" />
        </View>
      }
      ListFooterComponent={
        loadingMore ? <LoadingState label="Loading more..." /> : undefined
      }
      renderItem={({ item }) => <AnimeCard anime={item} />}
    />
  );
}

const getStyles = () => {
  return StyleSheet.create({
    content: {
      paddingHorizontal: 16,
      paddingBottom: 30,
      gap: 18,
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
