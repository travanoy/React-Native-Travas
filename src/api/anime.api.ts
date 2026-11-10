import type {
  AnimeDetail,
  AnimeFilters,
  BannerAnime,
  ContinueWatchingAnime,
  NewEpisodeAnime,
  PagedResult,
} from "@/types/anime-types";
import { http } from "./client";

export const animeApi = {
  getAll: (filters: AnimeFilters = {}, page = 1, pageSize = 24, signal?: AbortSignal) =>
    http.get<PagedResult<AnimeDetail>>("/anime", {
      query: {
        genre: filters.genre,
        status: filters.status,
        search: filters.search,
        page,
        pageSize,
      },
      signal,
    }),

  getById: (id: string) => http.get<AnimeDetail>(`/anime/${id}`),

  getBanner: () => http.get<BannerAnime>("/anime/banner"),

  getGenres: () => http.get<string[]>("/anime/genres"),

  getStatuses: () => http.get<string[]>("/anime/statuses"),

  getContinueWatching: () =>
    http.get<ContinueWatchingAnime[]>("/anime/continue-watching"),

  getNewEpisodes: () => http.get<NewEpisodeAnime[]>("/anime/new-episodes"),
};
