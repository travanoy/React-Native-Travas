import { reviewApi } from "@/api/review.api";
import { useCallback, useState } from "react";
import { useApi } from "./use-api";

export function useReviews(animeId: string) {
  const { data, loading, error, refetch } = useApi(
    () => reviewApi.getAll(animeId),
    [animeId],
  );
  const [saving, setSaving] = useState(false);

  const submit = useCallback(
    async (rating: number, text: string) => {
      setSaving(true);

      try {
        await reviewApi.upsert(animeId, {
          rating,
          text: text.trim() || undefined,
        });
        await refetch();
      } finally {
        setSaving(false);
      }
    },
    [animeId, refetch],
  );

  const remove = useCallback(async () => {
    setSaving(true);

    try {
      await reviewApi.remove(animeId);
      await refetch();
    } finally {
      setSaving(false);
    }
  }, [animeId, refetch]);

  return { reviews: data ?? [], loading, error, saving, submit, remove, refetch };
}
