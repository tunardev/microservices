import { Response } from "express";
import { Request } from "./types";
import * as database from "./database";
import axios from "axios";

export const posts = (req: Request, res: Response) => {
  const { limit, cursor } = req.query as any;

  const realLimit = Math.min(50, limit);
  const reaLimitPlusOne = realLimit + 1;

  const replacements: any[] = [reaLimitPlusOne];

  if (cursor) {
    replacements.push(new Date(parseInt(cursor)));
  }

  const posts: any[] = [];

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
  return false;
};
