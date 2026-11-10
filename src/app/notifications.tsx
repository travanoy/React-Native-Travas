import { notificationsApi } from "@/api/notifications.api";
import { EmptyState, ErrorState, LoadingState } from "@/components/StateView";
import { palette } from "@/constants/theme";
import { useLanguage } from "@/hooks/use-language";
import { useNotifications } from "@/hooks/use-notifications";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { t } = useLanguage();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);

  const { items, loading, loadingMore, error, refetch, loadMore } = useNotifications();

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        await notificationsApi.markAllRead();
      } catch {
      }

      if (active) {
        void refetch();
      }
    })();

    return () => {
      active = false;
    };
  }, [refetch]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t("notifications.title")}</Text>
      </View>

      {loading && items.length === 0 ? <LoadingState label={t("common.loading")} /> : null}
      {error ? <ErrorState message={error} onRetry={() => void refetch()} /> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={() => void loadMore()}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          loading || error ? undefined : (
            <View style={styles.emptyBody}>
              <EmptyState message={t("notifications.empty")} />
            </View>
          )
        }
        ListFooterComponent={
          loadingMore ? <LoadingState label={t("common.loadingMore")} /> : undefined
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            onPress={() => router.push(`/anime/${item.animeId}/page`)}
          >
            <Image source={{ uri: item.coverImage }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>
                {item.animeTitle}
              </Text>
              <Text style={styles.episode}>
                {t("notifications.episode", { n: item.episode })}
              </Text>
              <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
            </View>
            {!item.isRead ? <View style={styles.dot} /> : null}
          </Pressable>
        )}
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    list: {
      paddingHorizontal: 16,
      paddingBottom: 30,
      gap: 12,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
    },
    image: {
      width: 56,
      height: 74,
      borderRadius: 10,
      backgroundColor: colors.surfaceAlt,
    },
    info: {
      flex: 1,
      gap: 4,
    },
    title: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    episode: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.primary,
    },
    date: {
      fontSize: 12,
      color: colors.textMuted,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    emptyBody: {
      paddingTop: 60,
      alignItems: "center",
    },
    pressed: {
      opacity: 0.85,
    },
  });
};
