import { notificationsApi } from "@/api/notifications.api";
import { useApi } from "./use-api";
import { usePagination } from "./use-pagination";

export const useNotifications = () =>
  usePagination((page, signal) => notificationsApi.getAll(page, 20, signal), []);

export const useUnreadCount = () =>
  useApi(() => notificationsApi.getUnreadCount(), []);
