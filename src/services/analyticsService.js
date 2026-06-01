import ClickEvent from "../models/clickEventModel.js";
import Url from "../models/urlModel.js";

export const recordClickEvent = async (urlDoc, req) => {
  const { extractClickMetadata } = await import("../utils/clickMetadata.js");
  const metadata = extractClickMetadata(req);

  await ClickEvent.create({
    urlId: urlDoc._id,
    userId: urlDoc.userId,
    ...metadata,
  });
};

const groupByDate = (events, unit) => {
  const map = new Map();

  for (const event of events) {
    const date = new Date(event.createdAt);
    let key;

    if (unit === "day") {
      key = date.toISOString().slice(0, 10);
    } else if (unit === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().slice(0, 10);
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }

    map.set(key, (map.get(key) || 0) + 1);
  }

  return Array.from(map.entries())
    .map(([period, count]) => ({ period, count }))
    .sort((a, b) => a.period.localeCompare(b.period));
};

export const getUrlAnalytics = async (shortCode, userId) => {
  const urlDoc = await Url.findOne({ shortCode, userId });
  if (!urlDoc) {
    const error = new Error("URL not found");
    error.statusCode = 404;
    throw error;
  }

  const events = await ClickEvent.find({ urlId: urlDoc._id })
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  return {
    shortCode: urlDoc.shortCode,
    longUrl: urlDoc.longUrl,
    shortUrl: urlDoc.shortUrl,
    totalClicks: urlDoc.clicks,
    clicksPerDay: groupByDate(events, "day"),
    clicksPerWeek: groupByDate(events, "week"),
    clicksPerMonth: groupByDate(events, "month"),
    recentEvents: events.slice(0, 50).map((e) => ({
      browser: e.browser,
      device: e.device,
      os: e.os,
      referrer: e.referrer,
      country: e.country,
      city: e.city,
      timestamp: e.createdAt,
    })),
  };
};
