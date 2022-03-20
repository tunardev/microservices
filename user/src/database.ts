import { MongoClient, Document, ObjectId } from "mongodb";
import { createClient } from "redis";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: Date;
}

export const connectDatabase = async () => {
  const url = process.env.MONGODB_URL as string;
  const dbName = process.env.DB_NAME as string;
  const collectionName = process.env.COLLECTION_NAME as string;

  const mongoClient = new MongoClient(url);
  const client = await mongoClient.connect();

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  return collection;
};

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

export const create = async (data: User) => {
  const collection = await connectDatabase();
  await collection.insertOne(data);

  return data;
};

export const findByEmail = async (email: string) => {
  const collection = await connectDatabase();
  return collection.findOne({ email });
};

export const findById = async (id: string) => {
  const collection = await connectDatabase();
  return collection.findOne({ _id: new ObjectId(id) });
};

export const findByUsername = async (username: string) => {
  const collection = await connectDatabase();
  return collection.findOne({ username });
};

export const updateOne = async (id: string, data: any) => {
  const collection = await connectDatabase();
  collection.updateOne({ _id: id }, data);
};
