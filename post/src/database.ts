import { MongoClient, Document } from "mongodb";

export interface Post extends Document {
  avatar: string;
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

export const create = async (data: Post) => {
  const collection = await connectDatabase();
  return collection.insertOne(data);
};

