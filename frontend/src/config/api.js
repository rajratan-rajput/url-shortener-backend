/**
 * API base URL resolution for dev vs production.
 * - Dev: uses Vite proxy at /api when VITE_API_URL is unset
 * - Production: VITE_API_URL is required (set in Vercel/Render build env)
 */
export function resolveApiBaseUrl() {
  const configured = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");

  if (configured) {
    return configured;
  }

  if (import.meta.env.DEV) {
    return "/api";
  }

  throw new Error(
    "VITE_API_URL is not set. Configure it in your frontend deployment environment."
  );
}
