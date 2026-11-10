import { animeApi } from "@/api/anime.api";
import { savedApi } from "@/api/saved.api";
import { useApi } from "./use-api";
import { usePagination } from "./use-pagination";

export const useContinueWatching = () =>
  useApi(() => animeApi.getContinueWatching(), []);

export const useNewEpisodes = () => useApi(() => animeApi.getNewEpisodes(), []);

export const useSaved = (statusSlug: string) =>
  usePagination(
    (page, signal) => savedApi.getAll(statusSlug || undefined, page, 24, signal),
    [statusSlug],
  );

export const useWatchStatuses = () =>
  useApi(() => savedApi.getWatchStatuses(), []);
