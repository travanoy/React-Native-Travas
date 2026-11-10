import { authApi, SignInPayload, SignUpPayload } from "@/api/auth.api";
import {
  clearAuth,
  getStoredUser,
  setAuthTokens,
  setStoredUser,
} from "@/lib/user-storage";
import type { User } from "@/types/user-types";
import { useCallback } from "react";

export function useAuth() {
  const signIn = useCallback(async (payload: SignInPayload): Promise<User> => {
    const result = await authApi.signIn(payload);
    await setAuthTokens(result.accessToken, result.refreshToken);
    await setStoredUser(result.user);
    return result.user;
  }, []);

  const signUp = useCallback(async (payload: SignUpPayload): Promise<User> => {
    const result = await authApi.signUp(payload);
    await setAuthTokens(result.accessToken, result.refreshToken);
    await setStoredUser(result.user);
    return result.user;
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // Даже если сервер недоступен, локальную сессию нужно очистить.
    }

    await clearAuth();
  }, []);

  const loadCachedUser = useCallback(() => getStoredUser(), []);

  return { signIn, signUp, signOut, loadCachedUser };
}
