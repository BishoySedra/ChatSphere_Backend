import { createCustomError } from "../middlewares/errors/customError.js";
import * as bcrypt from "../helpers/bcrypt.js";

import * as jwt from "../helpers/jwt.js"

const users = [];

export const registerService = async (userData) => {
  const { username, email, password } = userData;

  // check if the user already exists
  const userExists = users.find((user) => user.email === email);

  if (userExists) {
    throw new createCustomError("User already exists", 409, null);
  }

  const hashedPassword = await bcrypt.hashPassword(password);

  users.push({ username, email, hashedPassword });

  return { username, email, hashedPassword };
};

export const loginService = async (userData) => {
  const { email, password } = userData;
  const existingUser = users.find(
    (user) => user.email === email
  );
  if(!existingUser)
      throw new createCustomError("Invalid email!",401,null)
  const isCorrectPassword = await bcrypt.comparePassword(password,existingUser.hashedPassword)
  if(!isCorrectPassword)
    throw new createCustomError("Invalid password!",401,null)
  let token = jwt.generateToken(email)
  return token;
};
