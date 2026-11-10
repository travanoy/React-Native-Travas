export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "") ??
  "https://api.example.com";

export const API_TIMEOUT = 15000;
