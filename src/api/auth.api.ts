import type { AuthResponse, User } from "@/types/user-types";
import { getRefreshToken } from "@/lib/user-storage";
import { http } from "./client";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  signIn: (payload: SignInPayload) =>
    http.post<AuthResponse>("/auth/login", payload),

  signUp: (payload: SignUpPayload) =>
    http.post<AuthResponse>("/auth/register", payload),

  refresh: (refreshToken: string) =>
    http.post<AuthResponse>("/auth/refresh", { refreshToken }, {
      skipAuthRefresh: true,
    }),

  me: () => http.get<User>("/auth/me"),

  /** Обёртка сама достаёт refresh-токен из хранилища. */
  logout: async () => {
    const refreshToken = await getRefreshToken();
    return http.post<void>("/auth/logout", { refreshToken });
  },
};
