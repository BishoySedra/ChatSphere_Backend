import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be at most 30 characters",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password cannot be empty",
      "string.pattern.base":
        "Password must have at least length of 8, have at least one lowercase letter, one uppercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
});

export const emailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
});

export const friendRequestSchema = Joi.object({
  sender: Joi.string().email().required().messages({
    "string.base": "Sender must be a string",
    "string.empty": "Sender cannot be empty",
    "string.email": "Sender must be a valid email",
    "any.required": "Sender is required",
  }),
  receiver: Joi.string().email().required().messages({
    "string.base": "Receiver must be a string",
    "string.empty": "Receiver cannot be empty",
    "string.email": "Receiver must be a valid email",
    "any.required": "Receiver is required",
  }),
});

export const changedUsernameSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be at most 30 characters",
    "any.required": "Username is required",
  }),
});
