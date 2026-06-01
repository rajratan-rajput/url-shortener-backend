import Url from "../models/urlModel.js";
import { renderQrCodePng } from "../services/qrService.js";

export const serveQrCode = async (req, res, next) => {
  try {
    const shortCode = req.params.fileName.replace(/\.png$/i, "");

    if (!shortCode) {
      return res.status(404).end();
    }

    const urlDoc = await Url.findOne({ shortCode }).select("shortUrl expiresAt");

    if (!urlDoc) {
      return res.status(404).end();
    }

    if (urlDoc.expiresAt && urlDoc.expiresAt.getTime() <= Date.now()) {
      return res.status(410).end();
    }

    const png = await renderQrCodePng(urlDoc.shortUrl);

    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(png);
  } catch (error) {
    next(error);
  }
};
