import Joi from "joi";

export const registerSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(50).lowercase().trim(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8).max(100).trim(),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8).max(100).trim(),
});

export const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object().keys({
  password: Joi.string().required().min(8).max(100).trim(),
  token: Joi.string().required(),
});

export const accountEditEmailSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8).max(100).trim(),
});

export const accountEditUsernameSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(50).lowercase().trim(),
  password: Joi.string().required().min(8).max(100).trim(),
});
