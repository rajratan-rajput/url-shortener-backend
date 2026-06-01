import Url from "../models/urlModel.js";

export const getDashboardStats = async (userId) => {
  const urls = await Url.find({ userId }).sort({ createdAt: -1 }).lean();

  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  const mostPopular = urls.reduce(
    (best, url) => (!best || url.clicks > best.clicks ? url : best),
    null
  );

  const latestUrl = urls[0] || null;

  return {
    totalUrls,
    totalClicks,
    mostPopularUrl: mostPopular
      ? {
          shortCode: mostPopular.shortCode,
          shortUrl: mostPopular.shortUrl,
          clicks: mostPopular.clicks,
        }
      : null,
    latestUrl: latestUrl
      ? {
          shortCode: latestUrl.shortCode,
          shortUrl: latestUrl.shortUrl,
          longUrl: latestUrl.longUrl,
          createdAt: latestUrl.createdAt,
        }
      : null,
  };
};
