import type { PagedResult } from "@/types/anime-types";
import type { NotificationItem } from "@/types/notification-types";
import { http } from "./client";

export const notificationsApi = {
  getAll: (page = 1, pageSize = 20, signal?: AbortSignal) =>
    http.get<PagedResult<NotificationItem>>("/notifications", {
      query: { page, pageSize },
      signal,
    }),

  getUnreadCount: () => http.get<{ count: number }>("/notifications/unread-count"),

  markAllRead: () => http.post<void>("/notifications/read"),

  markRead: (id: string) => http.patch<void>(`/notifications/${id}/read`),
};
