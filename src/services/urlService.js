import Url from "../models/urlModel.js";
import { nanoid } from "nanoid";
import { client } from "../config/redis.js";

const createShortUrl = async (longUrl) => {
  try {
    console.log("Received URL:", longUrl); // ✅ debug

    const shortCode = nanoid(6);
    console.log("Generated Code:", shortCode); // ✅ debug

    const newUrl = await Url.create({
      shortCode,
      longUrl,
    });

    console.log("Saved in MongoDB:", newUrl); // ✅ debug

    await client.set(shortCode, longUrl);
    console.log("Saved in Redis"); // ✅ debug

    return newUrl;
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
};

const getLongUrl = async (shortCode) => {
  try {
    // 1. Check Redis first (cache hit)
    const cachedUrl = await client.get(shortCode);
    if (cachedUrl) {
      return cachedUrl;
    }

    // 2. If not in cache → check MongoDB
    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      return null;
    }

    // 3. Store in Redis for future
    await client.set(shortCode, urlDoc.longUrl);

    return urlDoc.longUrl;
  } catch (error) {
    throw new Error("Error fetching URL");
  }
};

export { createShortUrl, getLongUrl };