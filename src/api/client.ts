import {
  clearAuth,
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  setRefreshToken,
  setStoredUser,
} from "@/lib/user-storage";
import type { AuthResponse } from "@/types/user-types";
import { API_TIMEOUT, API_URL } from "./config";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type Query = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface RequestOptions {
  method?: Method;
  query?: Query;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Внутренний флаг: не пытаться обновить токен (используется для auth-запросов). */
  skipAuthRefresh?: boolean;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const AUTH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

let refreshPromise: Promise<string | null> | null = null;

function buildUrl(path: string, query?: Query) {
  const url = path.startsWith("http")
    ? path
    : `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  if (!query) {
    return url;
  }

  const params = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );

  return params.length > 0 ? `${url}?${params.join("&")}` : url;
}

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function isAuthPath(path: string) {
  return AUTH_PATHS.some((authPath) => path.startsWith(authPath));
}

/**
 * Обновление access-токена по refresh. Single-flight: параллельные 401 ждут
 * один и тот же запрос, а не плодят десяток refresh-вызовов.
 */
async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      try {
        const response = await fetch(buildUrl("/auth/refresh"), {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          await clearAuth();
          return null;
        }

        const data = (await response.json()) as AuthResponse;
        await setAuthToken(data.accessToken);
        await setRefreshToken(data.refreshToken);
        if (data.user) {
          await setStoredUser(data.user);
        }

        return data.accessToken;
      } catch {
        return null;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function sendRequest(
  path: string,
  options: RequestOptions,
  token: string | null,
): Promise<Response> {
  const { method = "GET", query, body, headers, signal } = options;
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT);
  signal?.addEventListener("abort", onAbort);

  try {
    return await fetch(buildUrl(path, query), {
      method,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body !== undefined && !isFormData(body)
          ? { "Content-Type": "application/json" }
          : {}),
        ...headers,
      },
      body:
        body === undefined
          ? undefined
          : isFormData(body)
            ? body
            : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(0, "Request timeout");
    }

    throw new ApiError(
      0,
      error instanceof Error ? error.message : "Network error",
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data =
    response.status === 204
      ? null
      : isJson
        ? await response.json()
        : await response.text();

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : data && typeof data === "object" && "detail" in data
          ? String((data as { detail: unknown }).detail)
          : `HTTP ${response.status}`;

    throw new ApiError(response.status, message);
  }

  return data as T;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = await getAuthToken();
  let response = await sendRequest(path, options, token);

  if (
    response.status === 401 &&
    !options.skipAuthRefresh &&
    !isAuthPath(path)
  ) {
    const renewed = await refreshAccessToken();

    if (renewed) {
      response = await sendRequest(path, options, renewed);
    }
  }

  return parseResponse<T>(response);
}

export const http = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "GET" }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiFetch<T>(path, { ...options, method: "POST", body }),

  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiFetch<T>(path, { ...options, method: "PUT", body }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiFetch<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),

  upload: <T>(
    path: string,
    formData: FormData,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiFetch<T>(path, { ...options, method: "POST", body: formData }),
};
