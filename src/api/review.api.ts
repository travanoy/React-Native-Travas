import type { Review } from "@/types/review-types";
import { http } from "./client";

export const reviewApi = {
  getAll: (animeId: string) => http.get<Review[]>(`/anime/${animeId}/reviews`),

  upsert: (animeId: string, payload: { rating: number; text?: string }) =>
    http.put<Review>(`/anime/${animeId}/reviews`, payload),

  remove: (animeId: string) => http.delete<void>(`/anime/${animeId}/reviews`),
};
