import { userApi } from "@/api/user.api";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Platform } from "react-native";

/**
 * Запрашивает разрешение на пуш и отправляет Expo-токен на бэкенд.
 * Вызывается после входа (таб-навигатор) — fire-and-forget, ошибки не роняют UI.
 */
export async function registerPushToken(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      return;
    }

    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;

    if (status !== "granted") {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }

    if (status !== "granted") {
      return;
    }

    const { data: token } = await Notifications.getExpoPushTokenAsync();
    await userApi.setPushToken(token);
  } catch (error) {
    console.error("Push token registration failed:", error);
  }
}

function navigateToAnime(data: unknown): void {
  const id = (data as { id?: string } | null | undefined)?.id;
  if (id) {
    router.push(`/anime/${id}/page`);
  }
}

/**
 * Обработка тапа по пушу: открываем страницу аниме.
 * Возвращает функцию отписки.
 */
export function setupNotificationNavigation(): () => void {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => navigateToAnime(response.notification.request.content.data),
  );

  void (async () => {
    const response = await Notifications.getLastNotificationResponseAsync();
    if (response) {
      navigateToAnime(response.notification.request.content.data);
      await Notifications.clearLastNotificationResponseAsync();
    }
  })();

  return () => subscription.remove();
}
