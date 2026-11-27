import { API_BASE_URL } from "@/lib/constants";
import type { ApiError, ApiResponse } from "@/types";

export class ApiRequestError extends Error {
  statusCode: number;
  errorDetails?: unknown;

  constructor(message: string, statusCode: number, errorDetails?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
  }
}

export interface ApiFetchOptions extends RequestInit {
  /** Raw Cookie header value — used server-side to forward the httpOnly JWT */
  cookie?: string;
  /** Bearer token fallback */
  token?: string;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
  const { cookie, token, headers, body, ...rest } = options;

  const requestHeaders = new Headers(headers);

  if (body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (cookie) {
    requestHeaders.set("Cookie", cookie);
  }
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    body,
    headers: requestHeaders,
    credentials: "include",
    cache: rest.cache ?? "no-store",
  });

  let payload: ApiResponse<T> | ApiError;
  try {
    payload = await res.json();
  } catch {
    throw new ApiRequestError("Invalid JSON response from server", res.status);
  }

  if (!res.ok || !("success" in payload) || payload.success === false) {
    const err = payload as ApiError;
    throw new ApiRequestError(
      err.message || "Request failed",
      err.statusCode ?? res.status,
      err.errorDetails
    );
  }

  return payload as ApiResponse<T>;
}

/** Calls the API and unwraps `data` from the response envelope. */
export async function apiData<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const res = await apiFetch<T>(path, options);
  return res.data;
}
