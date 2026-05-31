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
    const cachedUrl = await client.get(shortCode);

    if (cachedUrl) {
      console.log("🔥 CACHE HIT");
      return cachedUrl;
    }

    console.log("💾 CACHE MISS");

    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      return null;
    }

    await client.set(shortCode, urlDoc.longUrl);

    console.log("✅ Saved to Redis from MongoDB");

    return urlDoc.longUrl;
  } catch (error) {
    throw new Error("Error fetching URL");
  }
};

export { createShortUrl, getLongUrl };