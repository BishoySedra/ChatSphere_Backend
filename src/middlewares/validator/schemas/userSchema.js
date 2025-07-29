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
    })
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

export const friendRequestResponseSchema = Joi.object({
  status: Joi.string().valid("ACCEPTED", "REJECTED").required().messages({
    "string.base": "Status must be a string",
    "string.empty": "Status cannot be empty",
    "any.only": "Status must be either accept or reject",
    "any.required": "Status is required",
  }),
})

export const changedUsernameSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be at most 30 characters",
    "any.required": "Username is required",
  }),
});

export const unfriendSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  friendEmail: Joi.string().email().required().messages({
    "string.base": "Friend email must be a string",
    "string.empty": "Friend email cannot be empty",
    "string.email": "Friend email must be a valid email",
    "any.required": "Friend email is required",
  }),
});

export const sendMessageURLSchema = Joi.object({
  senderEmail: Joi.string().email().required().messages({
    "string.base": "Sender email must be a string",
    "string.empty": "Sender email cannot be empty",
    "string.email": "Sender email must be a valid email",
    "any.required": "Sender email is required",
  }),
  chatID: Joi.string().required().messages({
    "string.base": "Chat ID must be a string",
    "string.empty": "Chat ID cannot be empty",
    "any.required": "Chat ID is required",
  })
});

export const deleteMessageURLSchema = Joi.object({
  senderEmail: Joi.string().email().required().messages({
    "string.base": "Sender email must be a string",
    "string.empty": "Sender email cannot be empty",
    "string.email": "Sender email must be a valid email",
    "any.required": "Sender email is required",
  }),
  chatID: Joi.string().required().messages({
    "string.base": "Chat ID must be a string",
    "string.empty": "Chat ID cannot be empty",
    "any.required": "Chat ID is required",
  }),
  messageID: Joi.string().required().messages({
    "string.base": "Message ID must be a string",
    "string.empty": "Message ID cannot be empty",
    "any.required": "Message ID is required",
  })
});

export const messageBodySchema = Joi.object({
  message: Joi.string().required().messages({
    "string.base": "Message must be a string",
    "string.empty": "Message cannot be empty",
    "any.required": "Message is required",
  }),
});

export const createGroupChatSchema = Joi.object({
  adminEmail: Joi.string().email().required().messages({
    "string.base": "Admin email must be a string",
    "string.empty": "Admin email cannot be empty",
    "string.email": "Admin email must be a valid email",
    "any.required": "Admin email is required",
  }),
  groupName: Joi.string().required().messages({
    "string.base": "Group name must be a string",
    "string.empty": "Group name cannot be empty",
    "any.required": "Group name is required",
  }),
  groupDescription: Joi.string().messages({
    "string.base": "Group description must be a string"
  }),
});

export const addUserToGroupChatSchema = Joi.object({
  adminEmail: Joi.string().email().required().messages({
    "string.base": "Admin email must be a string",
    "string.empty": "Admin email cannot be empty",
    "string.email": "Admin email must be a valid email",
    "any.required": "Admin email is required",
  }),
  userEmail: Joi.string().email().required().messages({
    "string.base": "User email must be a string",
    "string.empty": "User email cannot be empty",
    "string.email": "User email must be a valid email",
    "any.required": "User email is required",
  }),
  chatID: Joi.string().required().messages({
    "string.base": "Chat ID must be a string",
    "string.empty": "Chat ID cannot be empty",
    "any.required": "Chat ID is required",
  }),
});

export const chatIDSchema = Joi.object({
  chatID: Joi.string().required().messages({
    "string.base": "Chat ID must be a string",
    "string.empty": "Chat ID cannot be empty",
    "any.required": "Chat ID is required",
  }),
});