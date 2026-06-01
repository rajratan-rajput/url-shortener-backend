const RESERVED_ALIASES = new Set([
  "shorten",
  "stats",
  "health",
  "api",
  "admin",
  "auth",
  "dashboard",
  "analytics",
  "qr",
  "login",
  "register",
]);

const ALIAS_PATTERN = /^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?$/;

export function validateCustomAlias(rawAlias) {
  if (typeof rawAlias !== "string") {
    return { ok: false, message: "Custom alias must be a string" };
  }

  const normalized = rawAlias.trim().toLowerCase();

  if (!normalized) {
    return { ok: false, message: "Custom alias cannot be empty" };
  }

  if (normalized.length < 3 || normalized.length > 32) {
    return {
      ok: false,
      message: "Custom alias must be between 3 and 32 characters",
    };
  }

  if (!ALIAS_PATTERN.test(normalized)) {
    return {
      ok: false,
      message:
        "Custom alias may only contain letters, numbers, hyphens, and underscores, and cannot start or end with a hyphen",
    };
  }

  if (RESERVED_ALIASES.has(normalized)) {
    return { ok: false, message: "Custom alias is reserved" };
  }

  return { ok: true, normalizedAlias: normalized };
}
