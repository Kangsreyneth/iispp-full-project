import { auth, authReady } from "../firebase.js";

const configuredBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
export const API_BASE_URL = configuredBase && /\/api\/v1$/i.test(configuredBase)
  ? configuredBase
  : configuredBase ? `${configuredBase.replace(/\/api$/i, "")}/api/v1` : "";

async function request(path, options, authenticated) {
  if (!API_BASE_URL) {
    throw new Error("The API URL is not configured. Set VITE_API_BASE_URL in the frontend environment.");
  }

  let idToken;
  if (authenticated) {
    await authReady;
    const user = auth.currentUser;
    if (!user) throw new Error("Please sign in first.");
    idToken = await user.getIdToken();
  }

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const response = await fetch(
    `${API_BASE_URL}/${String(path).replace(/^\/+/, "")}`,
    {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || data.error?.message || `API request failed (${response.status})`);
    error.code = data.error?.code;
    error.status = response.status;
    throw error;
  }

  return data;
}

export const apiFetch = (path, options = {}) => request(path, options, true);
export const publicApiFetch = (path, options = {}) => request(path, options, false);
export const responseData = (response) => response?.data;

export function getMyProfile() {
  return apiFetch("/auth/me");
}
