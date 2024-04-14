import { createCustomError } from "../middlewares/errors/customError.js";
import * as bcrypt from "../helpers/bcrypt.js";

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

export const loginService = async (data) => {
  console.log("login service");
};
