import { SavedList } from "@/components/SavedList";
import { WatchingTypeTabs } from "@/components/WatchingTypeTabs";
import { palette } from "@/constants/theme";
import { useSaved, useWatchStatuses } from "@/hooks/use-collections";
import { useTheme } from "@/hooks/use-theme";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Saved() {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);
  const [selectedSlug, setSelectedSlug] = useState("");

  const { data: types } = useWatchStatuses();
  const { items: anime, loading, loadingMore, error, refetch, loadMore } =
    useSaved(selectedSlug);

  const firstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }

      void refetch();
    }, [refetch]),
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.tabsWrapper}>
        <WatchingTypeTabs
          types={types ?? []}
          selectedSlug={selectedSlug}
          setSelectedSlug={setSelectedSlug}
        />
      </View>

      <SavedList
        anime={anime}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        onRetry={() => void refetch()}
        onEndReached={() => void loadMore()}
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
    tabsWrapper: {
      marginHorizontal: -16,
      marginTop: 17,
      marginBottom: 20,
    },
  });
};
