import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("connect", () => {
  console.log("Redis Connected");
});

client.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

const connectRedis = async () => {
  await client.connect();
};

export { client, connectRedis };