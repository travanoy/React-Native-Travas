import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Saved() {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.empty}>Nothing here yet</Text>
      </View>
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
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
    },
    body: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    empty: {
      fontSize: 15,
      color: colors.textMuted,
    },
  });
};
