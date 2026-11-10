import type { PlayerData, WatchProgress } from "@/types/player-types";
import { http } from "./client";

export const playerApi = {
  getSources: (shikimoriId: number) =>
    http.get<PlayerData>("/player", { query: { shikimoriId } }),

  saveProgress: (progress: WatchProgress) =>
    http.post<void>("/progress", progress),
};
