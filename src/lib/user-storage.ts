import {
  AUTH_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from "@/constants/storage";
import { User } from "@/types/user-types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to read auth token:", error);
    return null;
  }
};

export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to read refresh token:", error);
    return null;
  }
};

export const setRefreshToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
};

export const setAuthTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  await AsyncStorage.multiSet([
    [AUTH_TOKEN_STORAGE_KEY, accessToken],
    [REFRESH_TOKEN_STORAGE_KEY, refreshToken],
  ]);
};

export const getStoredUser = async (): Promise<User | null> => {
  try {
    const raw = await AsyncStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch (error) {
    console.error("Failed to read user:", error);
    return null;
  }
};

export const setStoredUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearAuth = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    AUTH_TOKEN_STORAGE_KEY,
    REFRESH_TOKEN_STORAGE_KEY,
    USER_STORAGE_KEY,
  ]);
};
