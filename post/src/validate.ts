import Joi from "joi";

export const createPostSchema = Joi.object().keys({
  content: Joi.string().min(10).max(200),
});
