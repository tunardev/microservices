import { Schema, model, Document, models } from "mongoose";

const collectionName = process.env.COLLECTION_NAME as string;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: Date;
}

export default models[collectionName] || model<UserDocument>(collectionName, UserSchema);
