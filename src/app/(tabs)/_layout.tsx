import { palette } from "@/constants/theme";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { registerPushToken } from "@/lib/notifications";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";

export default function TabsLayout() {
  const { colorScheme } = useTheme();
  const { t } = useLanguage();
  const colors = palette[colorScheme];

  useEffect(() => {
    void registerPushToken();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: t("tabs.catalog"),
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: t("tabs.saved"),
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
