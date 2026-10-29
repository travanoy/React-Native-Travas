import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CONTINUE_WATCHING_LIST, ContinueWatchingAnime } from "@/components/mock/anime";

const shuffleArray = (array: ContinueWatchingAnime[]) =>
  [...array].sort(() => Math.random() - 0.5);

export default function ContinueWatchingScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);
  const [animeList, setAnimeList] = useState(() => shuffleArray(CONTINUE_WATCHING_LIST));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAnimeList(shuffleArray(CONTINUE_WATCHING_LIST));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Continue Watching</Text>
      </View>

      <FlatList
        data={animeList}
        renderItem={({ item }) => (
          <View style={styles.card}>
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
          </View>
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
  });
};
