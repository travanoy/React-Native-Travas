import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { getAuthToken } from "@/lib/user-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      const token = await getAuthToken();

      if (active) {
        router.replace(token ? "/home" : "/auth/sign-in");
      }
    }, 2000);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/travas-logo.jpg")}
        style={{ width: 300, height: 300 }}
      />
    </View>
  );
}

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
  });
};
