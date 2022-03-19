import { Response } from "express";
import { Request } from "./types";

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
