import User, { UserDocument } from "./database";
import { Request, Response } from "express";

export const findUser = async (req: Request, res: Response) => {
  const { username } = req.params;

  const data = await User.findOne({ username }, "-password");
  if (!data) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.status(200).json({ user: data });
};

export const search = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({
      message: "a required q",
    });
  }

  const users = await User.find();
  const search = users.filter((user: UserDocument) => {
    return user.username.includes(q as string);
  });

  return res.status(200).json({
    data: search,
  });
};
