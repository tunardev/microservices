import { createClient } from "redis";

export const connectRedis = async () => {
  const client = createClient();

  client.on("error", console.error);
  await client.connect();

  return client;
};

export const set = async (key: string, value: string) => {
  const client = await connectRedis();
  await client.set(key, value);
};

export const get = async (key: string) => {
  const client = await connectRedis();
  const value = await client.get(key);
  
  return value;
};
