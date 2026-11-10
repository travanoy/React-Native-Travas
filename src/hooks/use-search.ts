import { animeApi } from "@/api/anime.api";
import { usePagination } from "./use-pagination";

export const useSearchAnime = (query: string) =>
  usePagination(
    (page, signal) =>
      animeApi.getAll({ search: query.trim() || undefined }, page, 24, signal),
    [query],
    query.trim().length > 0,
  );
