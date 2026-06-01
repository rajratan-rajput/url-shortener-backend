import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";

export function extractClickMetadata(req) {
  const userAgent = req.get("user-agent") || "";
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const device = parser.getDevice();
  const os = parser.getOS();

  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "";

  const geo = ip ? geoip.lookup(ip.replace("::ffff:", "")) : null;

  return {
    browser: browser.name
      ? `${browser.name}${browser.version ? ` ${browser.version}` : ""}`
      : "Unknown",
    device: device.type || (device.vendor ? "Mobile" : "Desktop"),
    os: os.name ? `${os.name}${os.version ? ` ${os.version}` : ""}` : "Unknown",
    referrer: req.get("referer") || req.get("referrer") || "Direct",
    country: geo?.country || "Unknown",
    city: geo?.city || "Unknown",
  };
}
