export function validateHttpUrl(rawUrl) {
  if (typeof rawUrl !== "string") {
    return { ok: false, message: "Long URL must be a string" };
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { ok: false, message: "Long URL is required" };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, message: "Invalid URL format" };
  }

  const protocol = parsed.protocol.toLowerCase();
  if (protocol !== "http:" && protocol !== "https:") {
    // Explicitly rejects javascript:, data:, ftp:, etc.
    return { ok: false, message: "Only http and https URLs are allowed" };
  }

  return { ok: true, normalizedUrl: parsed.toString() };
}

