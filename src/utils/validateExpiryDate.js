export function validateExpiryDate(rawExpiry) {
  if (rawExpiry === undefined || rawExpiry === null || rawExpiry === "") {
    return { ok: true, expiresAt: null };
  }

  const expiresAt = new Date(rawExpiry);

  if (Number.isNaN(expiresAt.getTime())) {
    return { ok: false, message: "Invalid expiry date format" };
  }

  if (expiresAt.getTime() <= Date.now()) {
    return { ok: false, message: "Expiry date must be in the future" };
  }

  return { ok: true, expiresAt };
}
