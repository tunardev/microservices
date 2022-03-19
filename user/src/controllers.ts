import bcrypt from "bcrypt";
import * as database from "./database";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Request } from "./types";
import { UploadedFile } from "express-fileupload";
import path from "path";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await database.create({
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  delete (user as any).password;
  return res.status(201).json({
    message: "User created.",
    user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await database.findByEmail(email);
  if (!user) {
    return res.status(400).json({
      message: "User not found.",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid password.",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
    algorithm: "HS256",
  });

  return res.status(200).json({
    access_token: token,
  });
};

export const me = async (req: Request, res: Response) => {
  delete req.user.password;
  return res.status(200).json({
    user: req.user,
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await database.findByEmail(email);
  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  const token = uuidv4();
  await database.set(token, user.id);

  // await sendEmail();

  return res.status(200).json({
    message: "Email sent.",
  });
};

export const changePassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const userId = await database.get(token);
  if (!userId) {
    return res.status(400).json({
      message: "Invalid token.",
    });
  }

  const user = await database.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await database.updateOne(userId, {
    password: hashedPassword,
  });

  return res.status(200).json({
    message: "Password changed.",
  });
};

export const accountEditEmail = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await database.findByEmail(email);
  if (user) {
    return res.status(400).json({ message: "Email already in use." });
  }

  const isPasswordValid = await bcrypt.compare(password, req.user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password." });
  }

  await database.updateOne(req.user._id, { email });

  return res.status(200).json({ message: "Email changed." });
};

export const accountEditUsername = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await database.findByEmail(username);
  if (user) {
    return res.status(400).json({ message: "Username already in use." });
  }

  const isPasswordValid = await bcrypt.compare(password, req.user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password." });
  }

  await database.updateOne(req.user._id, { username });

  return res.status(200).json({ message: "Username changed." });
};

export const accountEditAvatar = async (req: Request, res: Response) => {
  const file = req.files?.avatar as UploadedFile;

  const extansion = path.extname(file.name);
  const fileName = `${uuidv4()}${extansion}`;

  const folderPath = path.join(
    __dirname,
    "..",
    "..",
    "cdn",
    "images",
    "avatars",
    req.user._id,
    fileName
  );

  file.mv(folderPath, async (err: Error) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    await database.updateOne(req.user._id, { avatar: fileName });

    return res
      .status(200)
      .json({ message: "Avatar uploaded.", file: fileName });
  });
};
