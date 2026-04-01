import { createShortUrl, getLongUrl } from "../services/urlService.js";

// POST /shorten
const shortenUrl = async (req, res, next) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      res.status(400);
      throw new Error("Long URL is required");
    }

    const url = await createShortUrl(longUrl);

    res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
    });
  } catch (err) {
    next(err); // 🔥 send to global handler
  }
};

// GET /:shortCode
const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const longUrl = await getLongUrl(shortCode);

    if (!longUrl) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.redirect(longUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { shortenUrl, redirectUrl };