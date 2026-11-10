import { playerApi } from "@/api/player.api";
import { useApi } from "./use-api";

export const usePlayer = (shikimoriId: number | null) =>
  useApi(
    () =>
      shikimoriId
        ? playerApi.getSources(shikimoriId)
        : Promise.reject(new Error("Missing shikimori id")),
    [shikimoriId],
  );
