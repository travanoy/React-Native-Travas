import type { AnimeDetail, PagedResult, WatchingType } from "@/types/anime-types";
import { http } from "./client";

export const savedApi = {
  getAll: (statusSlug?: string, page = 1, pageSize = 24, signal?: AbortSignal) =>
    http.get<PagedResult<AnimeDetail>>("/saved", {
      query: { status: statusSlug, page, pageSize },
      signal,
    }),

  getWatchStatuses: () => http.get<WatchingType[]>("/watch-statuses"),

  setWatchStatus: (animeId: string, statusSlug: string) =>
    http.put<AnimeDetail>(`/anime/${animeId}/watch-status`, { statusSlug }),

  removeWatchStatus: (animeId: string) =>
    http.delete<void>(`/anime/${animeId}/watch-status`),
};
