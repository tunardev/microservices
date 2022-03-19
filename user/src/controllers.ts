import bcrypt from "bcrypt";
import * as database from "./database";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

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
  const token = req.headers.authorization as string;
  if (!token) {
    return res.status(401).json({
      message: "No token provided.",
    });
  }

  const bearer = token.split(" ");
  if (!bearer || bearer.length !== 2) {
    return res.status(401).json({
      message: "Invalid token.",
    });
  }

  try {
    const payload = jwt.verify(bearer[1], process.env.JWT_SECRET as string) as {
      id: string;
    };

    const user = await database.findById(payload.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch {
    return res.status(401).json({
      message: "Invalid token.",
    });
  }
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
