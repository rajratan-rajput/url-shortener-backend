import client from "./client";

export const createUrl = async (payload) => {
  const { data } = await client.post("/url/create", payload);
  return data;
};

export const getMyUrls = async ({ page = 1, limit = 10, search = "" }) => {
  const { data } = await client.get("/url/my-urls", {
    params: { page, limit, search },
  });
  return data;
};

export const deleteUrl = async (id) => {
  const { data } = await client.delete(`/url/${id}`);
  return data;
};

export const getDashboardStats = async () => {
  const { data } = await client.get("/dashboard/stats");
  return data;
};

export const getUrlAnalytics = async (shortCode) => {
  const { data } = await client.get(`/analytics/${encodeURIComponent(shortCode)}`);
  return data;
};
