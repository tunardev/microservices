import { Response, NextFunction } from "express";
import { Request } from "./types";
import Joi from "joi";
import axios from "axios";

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

  axios
    .get("http://localhost:5000/api/@me", {
      headers: {
        Authorization: `Bearer ${bearer[1]}`,
      },
    })
    .then(({ data }) => {
      req.user = data.user;

      return next();
    })
    .catch(() => {
      return res.status(401).json({ message: "Invalid token." });
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
