import { getUrlAnalytics } from "../services/analyticsService.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await getUrlAnalytics(req.params.shortCode, req.user._id);
    res.status(200).json(data);
  } catch (error) {
    if (error.statusCode === 404) res.status(404);
    next(error);
  }
};
