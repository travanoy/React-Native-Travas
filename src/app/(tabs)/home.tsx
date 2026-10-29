import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimeBanner } from "@/components/AnimeBanner";
import { ContinueWatching } from "@/components/ContinueWatching";
import { NewEpisodes } from "@/components/NewEpisodes";
import { BANNER_ANIME } from "@/components/mock/anime";

export default function HomeScreen() {
  const { colorScheme, toggleTheme } = useTheme();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);

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
              <Ionicons name="search-outline" size={22} color={colors.text} />
            </Pressable>
            <Pressable
              style={styles.iconButton}
              onPress={() => toggleTheme(colorScheme === "dark" ? "light" : "dark")}
            >
              <Ionicons
                name={colorScheme === "dark" ? "sunny-outline" : "moon-outline"}
                size={22}
                color={colors.text}
              />
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
  });
};
