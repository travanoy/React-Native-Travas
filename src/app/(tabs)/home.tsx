import { AnimeBanner } from "@/components/AnimeBanner";
import { AnimeCard } from "@/components/AnimeCard";
import { ContinueWatching } from "@/components/ContinueWatching";
import { NewEpisodes } from "@/components/NewEpisodes";
import { EmptyState, ErrorState, LoadingState } from "@/components/StateView";
import { palette } from "@/constants/theme";
import { useBanner } from "@/hooks/use-anime";
import { useLanguage } from "@/hooks/use-language";
import { useUnreadCount } from "@/hooks/use-notifications";
import { useSearchAnime } from "@/hooks/use-search";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { t } = useLanguage();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);
  const { data: banner, loading, error, refetch } = useBanner();
  const { data: unread, refetch: refetchUnread } = useUnreadCount();
  const unreadCount = unread?.count ?? 0;

  useFocusEffect(
    useCallback(() => {
      void refetchUnread();
    }, [refetchUnread]),
  );

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    items: results,
    loading: searchLoading,
    loadingMore,
    error: searchError,
    refetch: searchRefetch,
    loadMore,
  } = useSearchAnime(searchQuery);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Travas</Text>
        <View style={styles.headerIcons}>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            {unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder={t("home.searchPlaceholder")}
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          underlineColorAndroid="transparent"
        />
        {searchInput ? (
          <Pressable hitSlop={8} onPress={() => setSearchInput("")}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {isSearching ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onEndReached={() => void loadMore()}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            searchLoading ? (
              <LoadingState label={t("home.searching")} />
            ) : searchError ? (
              <ErrorState message={searchError} onRetry={() => void searchRefetch()} />
            ) : undefined
          }
          ListEmptyComponent={
            searchLoading || searchError ? undefined : (
              <View style={styles.emptyBody}>
                <EmptyState
                  message={
                    searchInput ? t("home.noResults") : t("home.typeToSearch")
                  }
                />
              </View>
            )
          }
          ListFooterComponent={
            loadingMore ? <LoadingState label={t("common.loadingMore")} /> : undefined
          }
          renderItem={({ item }) => <AnimeCard anime={item} />}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {banner ? <AnimeBanner anime={banner} /> : null}

          {loading && !banner ? (
            <View style={styles.bannerState}>
              <LoadingState label={t("home.loadingBanner")} />
            </View>
          ) : null}

          {error ? <ErrorState message={error} onRetry={() => void refetch()} /> : null}

          <ContinueWatching />
          <NewEpisodes />
        </ScrollView>
      )}
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
      paddingTop: 10,
      paddingBottom: 30,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingHorizontal: 16,
      paddingTop: 10,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
    },
    headerIcons: {
      flexDirection: "row",
      gap: 12,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    badge: {
      position: "absolute",
      top: -2,
      right: -2,
      minWidth: 16,
      height: 16,
      paddingHorizontal: 3,
      borderRadius: 8,
      backgroundColor: colors.danger,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    bannerState: {
      height: 200,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: "center",
      marginBottom: 28,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginHorizontal: 16,
      marginBottom: 16,
      paddingHorizontal: 14,
      height: 46,
      borderRadius: 14,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      outlineWidth: 0,
    },
    resultsContent: {
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
