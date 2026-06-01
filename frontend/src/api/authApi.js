import client from "./client";

export const registerUser = async (payload) => {
  const { data } = await client.post("/auth/register", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await client.post("/auth/login", payload);
  return data;
};

export const logoutUser = async () => {
  const { data } = await client.post("/auth/logout");
  return data;
};

export const getProfile = async () => {
  const { data } = await client.get("/auth/me");
  return data;
};
