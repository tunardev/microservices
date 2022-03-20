import { Response } from "express";
import { Request } from "./types";
import  * as database from "./database";
import { Post } from "./database";
import axios from "axios";
import { UploadedFile } from "express-fileupload";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const posts = (req: Request, res: Response) => {
  const { limit, cursor } = req.query as any;

  const realLimit = Math.min(50, limit);
  const reaLimitPlusOne = realLimit + 1;

  const replacements: any[] = [reaLimitPlusOne];

  if (cursor) {
    replacements.push(new Date(parseInt(cursor)));
  }

  const posts: Post[] = [];

  return {
    posts: posts.slice(0, realLimit),
    hasMore: posts.length === reaLimitPlusOne,
  };
};

export const post = async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  const { id } = req.params;
  let isDeleted = false;

  const data = await database.findById(id);
  if (!data) {
    return res.status(404).json({ message: "Post not found." });
  }

  if (token) {
    const bearer = token.split(" ");

    if (bearer && bearer.length == 2) {
      try {
        const { data } = await axios.get("http://localhost:5000/api/@me", {
          headers: {
            Authorization: `Bearer ${bearer[1]}`,
          },
        });

        if (data.user._id == data.userId) isDeleted = true;
      } catch {}
    }
  }

  return res.status(200).json({ post: data, isDeleted });
};

export const createPost = async (req: Request, res: Response) => {
  const { content } = req.body;
  const file = req.files?.post as UploadedFile;

  const extansion = path.extname(file.name);
  const fileName = `${uuidv4()}${extansion}`;

  const folderPath = path.join(
    __dirname,
    "..",
    "..",
    "cdn",
    "images",
    "avatars",
    fileName
  );

  file.mv(folderPath, async (err: Error) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const post = {
      avatar: fileName,
      userId: req.user._id,
      createdAt: new Date(),
    } as Post;
    if (content) post.content = content;

    await database.create(post);

    return res.status(200).json({ post });
  });
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  const data = await database.findById(id);
  if (!data) {
    return res.status(404).json({ message: "Post not found." });
  }

  if (req.user._id != data.userId) {
    return res
      .status(400)
      .json({ message: "You do not have the necessary authorization." });
  }

  return res.status(200).json({ message: "Post deleted." });
};
