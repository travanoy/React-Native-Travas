import { authApi } from "@/api/auth.api";
import { userApi } from "@/api/user.api";
import { getStoredUser, setStoredUser } from "@/lib/user-storage";
import type { User, UserStats } from "@/types/user-types";
import { useCallback, useEffect, useState } from "react";

export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);

    try {
      const me = await authApi.me();
      setUser(me);
      setError(null);
      await setStoredUser(me);
    } catch (cause) {
      const cached = await getStoredUser();

      if (cached) {
        setUser(cached);
      } else {
        setError(cause instanceof Error ? cause.message : "Request failed");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadStats = useCallback(async () => {
    try {
      setStats(await userApi.getStats());
    } catch {
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reloadStats();
  }, [reloadStats]);

  const updateName = useCallback(async (name: string) => {
    const next = await userApi.updateProfile({ name });
    setUser(next);
    await setStoredUser(next);
    return next;
  }, []);

  const updateAvatar = useCallback(async (uri: string) => {
    const next = await userApi.uploadAvatar(uri);
    setUser(next);
    await setStoredUser(next);
    return next;
  }, []);

  return { user, stats, loading, error, reload, reloadStats, updateName, updateAvatar };
}
