import { Response, NextFunction } from "express";
import { Request } from "./types";
import jwt from "jsonwebtoken";
import Joi from "joi";
import * as database from "./database";

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
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

  jwt.verify(token, process.env.JWT_SECRET as string, async (error: any, data: any) => {
      if (error) {
        return res.status(401).json({
          message: "Invalid token.",
        });
      }

      const user = await database.findById(data.id);
      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      req.user = user;
      next();
  });
};

export const validate = (schema: Joi.Schema<any>) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return next();
};
