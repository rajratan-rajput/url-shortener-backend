import Url from "../models/urlModel.js";
import { nanoid } from "nanoid";
import { client } from "../config/redis.js";
import { buildQrCodeUrl } from "./qrService.js";
import { recordClickEvent } from "./analyticsService.js";
import { getBaseUrl } from "../config/env.js";

const getRedisTtlSeconds = (expiresAt) => {
  const seconds = Math.ceil((expiresAt.getTime() - Date.now()) / 1000);
  return Math.max(1, seconds);
};

const isExpired = (expiresAt) =>
  expiresAt && new Date(expiresAt).getTime() <= Date.now();

const toCachePayload = (longUrl, expiresAt) =>
  JSON.stringify({
    longUrl,
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
  });

const parseCachePayload = (cached) => {
  try {
    const parsed = JSON.parse(cached);
    if (parsed && typeof parsed.longUrl === "string") {
      return parsed;
    }
  } catch {
    // Legacy plain string cache
  }
  return { longUrl: cached, expiresAt: null };
};

const setCache = async (shortCode, longUrl, expiresAt = null) => {
  const value = toCachePayload(longUrl, expiresAt);
  if (expiresAt) {
    await client.set(shortCode, value, { EX: getRedisTtlSeconds(expiresAt) });
  } else {
    await client.set(shortCode, value);
  }
};

const clearCache = async (shortCode) => {
  await client.del(shortCode);
};

export const createShortUrl = async (
  userId,
  longUrl,
  customAlias = null,
  expiresAt = null
) => {
  let shortCode;

  if (customAlias) {
    const existing = await Url.findOne({ shortCode: customAlias });
    if (existing) {
      const error = new Error("Custom alias is already taken");
      error.statusCode = 409;
      throw error;
    }
    shortCode = customAlias;
  } else {
    shortCode = nanoid(6);
  }

  const baseUrl = getBaseUrl();
  const shortUrl = `${baseUrl}/${shortCode}`;
  const qrCode = buildQrCodeUrl(shortCode, baseUrl);

  try {
    const newUrl = await Url.create({
      userId,
      longUrl,
      shortCode,
      shortUrl,
      qrCode,
      expiresAt,
    });

    await setCache(shortCode, longUrl, expiresAt);
    return newUrl;
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error("Custom alias is already taken");
      duplicateError.statusCode = 409;
      throw duplicateError;
    }
    throw error;
  }
};

export const getUserUrls = async (userId, { page = 1, limit = 10, search = "" }) => {
  const query = { userId };

  if (search.trim()) {
    const term = search.trim();
    query.$or = [
      { longUrl: { $regex: term, $options: "i" } },
      { shortCode: { $regex: term, $options: "i" } },
      { shortUrl: { $regex: term, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [urls, total] = await Promise.all([
    Url.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Url.countDocuments(query),
  ]);

  return {
    urls,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
};

export const deleteUserUrl = async (userId, urlId) => {
  const urlDoc = await Url.findOne({ _id: urlId, userId });
  if (!urlDoc) {
    const error = new Error("URL not found");
    error.statusCode = 404;
    throw error;
  }

  await Url.deleteOne({ _id: urlId });
  await clearCache(urlDoc.shortCode);

  return urlDoc;
};

export const getLongUrlAndIncrementClicks = async (shortCode, req = null) => {
  const cached = await client.get(shortCode);

  let urlDoc;

  if (cached) {
    const { longUrl, expiresAt } = parseCachePayload(cached);
    if (isExpired(expiresAt)) return { expired: true };

    urlDoc = await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!urlDoc) return { notFound: true };
    if (req) recordClickEvent(urlDoc, req).catch(() => {});
    return { longUrl: urlDoc.longUrl };
  }

  urlDoc = await Url.findOne({ shortCode });
  if (!urlDoc) return { notFound: true };
  if (isExpired(urlDoc.expiresAt)) return { expired: true };

  await Url.updateOne({ shortCode }, { $inc: { clicks: 1 } });
  await setCache(shortCode, urlDoc.longUrl, urlDoc.expiresAt);

  if (req) {
    urlDoc.clicks += 1;
    recordClickEvent(urlDoc, req).catch(() => {});
  }

  return { longUrl: urlDoc.longUrl };
};

export const getUrlStats = async (shortCode, userId = null) => {
  const query = userId ? { shortCode, userId } : { shortCode };
  return Url.findOne(query).select(
    "shortCode longUrl shortUrl qrCode clicks expiresAt createdAt updatedAt userId"
  );
};
