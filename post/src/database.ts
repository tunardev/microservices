import { MongoClient, Document, ObjectId } from "mongodb";

export interface Post extends Document {
  avatar: string;
  content?: string;
  userId: string;
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

export const find = async (data?: any) => {
  const collection = await connectDatabase();
  return collection.find(data || {});
};

export const findById = async (id: string) => {
  const collection = await connectDatabase();
  return collection.findOne({ _id: new ObjectId(id) });
};

export const create = async (data: Post) => {
  const collection = await connectDatabase();
  return collection.insertOne(data);
};
