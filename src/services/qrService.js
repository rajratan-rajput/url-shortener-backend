import QRCode from "qrcode";

/**
 * QR codes are served dynamically at GET /qr/:shortCode.png (no filesystem).
 * Safe for Render and other ephemeral containers.
 */
export function buildQrCodeUrl(shortCode, baseUrl) {
  return `${baseUrl}/qr/${shortCode}.png`;
}

export async function renderQrCodePng(targetUrl) {
  return QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 300,
  });
}

/** @deprecated Filesystem QR removed; kept as no-op for callers */
export async function ensureQrDir() {}

/** @deprecated */
export async function generateQrCode(shortCode, shortUrl, baseUrl) {
  return buildQrCodeUrl(shortCode, baseUrl);
}

/** @deprecated */
export async function deleteQrCode() {}
