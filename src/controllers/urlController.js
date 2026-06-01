import {
  createShortUrl,
  getUserUrls,
  deleteUserUrl,
  getLongUrlAndIncrementClicks,
} from "../services/urlService.js";
import { validateHttpUrl } from "../utils/validateUrl.js";
import { validateCustomAlias } from "../utils/validateCustomAlias.js";
import { validateExpiryDate } from "../utils/validateExpiryDate.js";

export const createUrl = async (req, res, next) => {
  try {
    const { url, longUrl, customAlias, expiresAt, expiryDate } = req.body;
    const rawUrl = url ?? longUrl;
    const rawExpiry = expiresAt ?? expiryDate;

    const validation = validateHttpUrl(rawUrl);
    if (!validation.ok) {
      res.status(400);
      throw new Error(validation.message);
    }

    let normalizedAlias = null;
    if (customAlias !== undefined && customAlias !== null && customAlias !== "") {
      const aliasValidation = validateCustomAlias(customAlias);
      if (!aliasValidation.ok) {
        res.status(400);
        throw new Error(aliasValidation.message);
      }
      normalizedAlias = aliasValidation.normalizedAlias;
    }

    const expiryValidation = validateExpiryDate(rawExpiry);
    if (!expiryValidation.ok) {
      res.status(400);
      throw new Error(expiryValidation.message);
    }

    const urlDoc = await createShortUrl(
      req.user._id,
      validation.normalizedUrl,
      normalizedAlias,
      expiryValidation.expiresAt
    );

    res.status(201).json({
      id: urlDoc._id,
      shortUrl: urlDoc.shortUrl,
      shortCode: urlDoc.shortCode,
      qrCode: urlDoc.qrCode,
      longUrl: urlDoc.longUrl,
      clicks: urlDoc.clicks,
      expiresAt: urlDoc.expiresAt,
      createdAt: urlDoc.createdAt,
    });
  } catch (error) {
    if (error.statusCode === 409) res.status(409);
    next(error);
  }
};

export const getMyUrls = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const search = req.query.search || "";

    const result = await getUserUrls(req.user._id, { page, limit, search });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteUrl = async (req, res, next) => {
  try {
    await deleteUserUrl(req.user._id, req.params.id);
    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    if (error.statusCode === 404) res.status(404);
    next(error);
  }
};

export const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const result = await getLongUrlAndIncrementClicks(shortCode, req);

    if (result.expired) {
      return res.status(410).json({ message: "URL has expired" });
    }
    if (result.notFound) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.redirect(result.longUrl);
  } catch (error) {
    next(error);
  }
};
