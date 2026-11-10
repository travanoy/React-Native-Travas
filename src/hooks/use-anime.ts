import { animeApi } from "@/api/anime.api";
import type { AnimeFilters } from "@/types/anime-types";
import { useApi } from "./use-api";
import { usePagination } from "./use-pagination";

export const useAnimeList = (filters: AnimeFilters) =>
  usePagination(
    (page, signal) => animeApi.getAll(filters, page, 24, signal),
    [filters.genre, filters.status, filters.search],
  );

export const useAnimeDetail = (id: string) =>
  useApi(() => animeApi.getById(id), [id]);

export const useBanner = () => useApi(() => animeApi.getBanner(), []);

export const useGenres = () => useApi(() => animeApi.getGenres(), []);

export const useAiringStatuses = () => useApi(() => animeApi.getStatuses(), []);
