import Joi from "joi";

export const registerSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8).max(100),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object().keys({
  password: Joi.string().required().min(8).max(100),
  token: Joi.string().required(),
});

export const accountEditEmailSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8).max(100),
});

export const accountEditUsernameSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(50),
  password: Joi.string().required().min(8).max(100),
});
