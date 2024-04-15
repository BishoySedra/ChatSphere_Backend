import { createCustomError } from "../middlewares/errors/customError.js";
import * as bcrypt from "../helpers/bcrypt.js";
import * as jwt from "../helpers/jwt.js";
import User from "../db/models/user.js";

export const registerService = async (userData) => {
  const { username, email, password } = userData;

  // check if the user already exists using mongoose
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new createCustomError("User already exists", 409, null);
  }

  const hashedPassword = await bcrypt.hashPassword(password);

  // save the user to the database using mongoose
  const user = new User({
    username,
    email,
    password: hashedPassword,
    friends: [],
  });
  await user.save();

  return { username, email };
};

export const loginService = async (userData) => {
  const { email, password } = userData;

  // check if the user already exists using mongoose
  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new createCustomError("Invalid Email!", 401, null);
  }

  const isCorrectPassword = await bcrypt.comparePassword(
    password,
    existedUser.password
  );

  if (!isCorrectPassword) {
    throw new createCustomError("Invalid Password!", 401, null);
  }

  let token = jwt.generateToken([
    {
      email: existedUser.email,
    },
    {
      id: existedUser._id,
    },
  ]);

  return token;
};

export const getAllUsers = async () => {
  const users = await User.find();
  return users;
};
