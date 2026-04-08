import { env } from "@/lib/env";

const BASE_URL = env.NEXT_PUBLIC_API_URL;

let accessTokenCache: string | null = null;
let refreshPromise: Promise<string> | null = null;
const accessTokenListeners = new Set<(token: string | null) => void>();

export function setAccessToken(token: string | null) {
  accessTokenCache = token;

  accessTokenListeners.forEach((listener) => {
    listener(token);
  });
}

export function subscribeToAccessToken(
  listener: (token: string | null) => void,
) {
  accessTokenListeners.add(listener);

  return () => {
    accessTokenListeners.delete(listener);
  };
}

export async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = request<{ accessToken: string }>("/auth/refresh", {
      method: "POST",
    })
      .then((result) => {
        setAccessToken(result.accessToken);
        return result.accessToken;
      })
      .catch(() => {
        setAccessToken(null);
        throw { status: 401, message: "Oturum süresi doldu." };
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };

  if (accessTokenCache) {
    headers.Authorization = `Bearer ${accessTokenCache}`;
  }

  // Don't set Content-Type for FormData; the browser adds the boundary.
  if (!(options?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Bir hata oluştu" }));

    if (res.status === 401 && !path.startsWith("/auth/")) {
      try {
        await refreshAccessToken();
      } catch {
        throw { status: 401, message: "Oturum süresi doldu." };
      }

      return request<T>(path, options);
    }

    if (res.status === 401) {
      throw { status: 401, message: error.message || "Unauthorized" };
    }

    throw new Error(error.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
