import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NEW_EPISODES_LIST, NewEpisodeAnime } from "@/components/mock/anime";

const shuffleArray = (array: NewEpisodeAnime[]) =>
  [...array].sort(() => Math.random() - 0.5);

export default function NewEpisodesScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);
  const [animeList, setAnimeList] = useState(() => shuffleArray(NEW_EPISODES_LIST));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAnimeList(shuffleArray(NEW_EPISODES_LIST));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>New Episodes</Text>
      </View>

      <FlatList
        data={animeList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.coverImage }} style={styles.image} />
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
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
    title: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
  });
};
