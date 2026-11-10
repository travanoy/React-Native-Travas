import type { User, UserStats } from "@/types/user-types";
import { http } from "./client";

export interface UpdateProfilePayload {
  name?: string;
}

export const userApi = {
  updateProfile: (payload: UpdateProfilePayload) =>
    http.patch<User>("/users/me", payload),

  setPushToken: (token: string) =>
    http.put<void>("/users/me/push-token", { expoPushToken: token }),

  getStats: () => http.get<UserStats>("/users/me/stats"),

  uploadAvatar: (uri: string) => {
    const form = new FormData();
    const name = uri.split("/").pop() ?? "avatar.jpg";
    const extension = name.split(".").pop()?.toLowerCase();
    const type = extension === "png" ? "image/png" : "image/jpeg";

    form.append("avatar", { uri, name, type } as unknown as Blob);

    return http.upload<User>("/users/me/avatar", form);
  },
};
