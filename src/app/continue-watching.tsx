import { ErrorState, LoadingState } from "@/components/StateView";
import { palette } from "@/constants/theme";
import { useContinueWatching } from "@/hooks/use-collections";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContinueWatchingScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { t } = useLanguage();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);
  const { data, loading, error, refetch } = useContinueWatching();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t("continueWatching.title")}</Text>
      </View>

      {loading && !data ? <LoadingState label={t("common.loadingList")} /> : null}
      {error ? <ErrorState message={error} onRetry={() => void refetch()} /> : null}

      <FlatList
        data={data ?? []}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            onPress={() =>
              router.push({
                pathname: "/anime/[id]/watch",
                params: { id: item.id, shikimoriId: String(item.shikimoriId) },
              })
            }
          >
            <Image source={{ uri: item.coverImage }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.time}>
                {item.currentTime} / {item.totalTime}
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
              </View>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
      gap: 14,
      alignItems: "center",
    },
    image: {
      width: 96,
      height: 132,
      borderRadius: 14,
    },
    info: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 6,
    },
    time: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 8,
    },
    progressTrack: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.surfaceAlt,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    pressed: {
      opacity: 0.8,
    },
  });
};
