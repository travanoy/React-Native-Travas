import { Ionicons } from "@expo/vector-icons";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimeBanner } from "@/components/AnimeBanner";
import { ContinueWatchingCard } from "@/components/ContinueWatchingCard";
import { NewEpisodeCard } from "@/components/NewEpisodeCard";
import {
  BANNER_ANIME,
  CONTINUE_WATCHING_LIST,
  NEW_EPISODES_LIST,
  ContinueWatchingAnime,
  NewEpisodeAnime,
} from "@/components/mock/anime";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={[]}
        renderItem={() => null}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Travas</Text>
              <View style={styles.headerIcons}>
                <Pressable style={styles.iconButton}>
                  <Ionicons name="search-outline" size={22} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>

            <AnimeBanner anime={BANNER_ANIME} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Continue Watching</Text>
              <Text style={styles.seeAll}>All &gt;</Text>
            </View>
            <FlatList
              data={CONTINUE_WATCHING_LIST}
              renderItem={({ item }: { item: ContinueWatchingAnime }) => (
                <ContinueWatchingCard anime={item} />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.row}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New Episodes</Text>
              <Text style={styles.seeAll}>All &gt;</Text>
            </View>
            <FlatList
              data={NEW_EPISODES_LIST}
              renderItem={({ item }: { item: NewEpisodeAnime }) => (
                <NewEpisodeCard anime={item} />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.row}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0D0E15",
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1C28",
    alignItems: "center",
    justifyContent: "center",
  },
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
