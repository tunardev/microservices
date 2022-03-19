import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate = (schema: Joi.Schema<any>) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return next();
};

