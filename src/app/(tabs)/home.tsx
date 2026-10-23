import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimeBanner } from "@/components/AnimeBanner";
import { ContinueWatching } from "@/components/ContinueWatching";
import { NewEpisodes } from "@/components/NewEpisodes";
import { BANNER_ANIME } from "@/components/mock/anime";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Travas</Text>
          <View style={styles.headerIcons}>
            <Pressable style={styles.iconButton}>
              <Ionicons name="search-outline" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <AnimeBanner anime={BANNER_ANIME} />

        <ContinueWatching />
        <NewEpisodes />
      </ScrollView>
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
});
