import { getDashboardStats } from "../services/dashboardService.js";

export const getStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStats(req.user._id);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};
