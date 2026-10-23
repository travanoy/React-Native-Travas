import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ContinueWatchingCard } from "@/components/ContinueWatchingCard";
import { CONTINUE_WATCHING_LIST } from "@/components/mock/anime";

export function ContinueWatching() {
  const router = useRouter();

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Continue Watching</Text>
        <Pressable hitSlop={8} onPress={() => router.push("/continue-watching")}>
          <Text style={styles.seeAll}>All &gt;</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {CONTINUE_WATCHING_LIST.map((anime) => (
          <ContinueWatchingCard key={anime.id} anime={anime} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  seeAll: {
    fontSize: 14,
    color: "#8A8D9F",
  },
  row: {
    gap: 14,
    paddingBottom: 24,
  },
});
