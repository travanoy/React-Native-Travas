import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ContinueWatchingCard } from "@/components/ContinueWatchingCard";
import { CONTINUE_WATCHING_LIST } from "@/components/mock/anime";

export function ContinueWatching() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

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

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    seeAll: {
      fontSize: 14,
      color: colors.textMuted,
    },
    row: {
      gap: 14,
      paddingBottom: 24,
    },
  });
};
