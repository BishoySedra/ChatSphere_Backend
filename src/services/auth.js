import { createCustomError } from "../middlewares/errors/customError.js";
import * as bcrypt from "../helpers/bcrypt.js";
import * as jwt from "../helpers/jwt.js";
import User from "../db/models/user.js";
import sendEmail from "../helpers/emailSending.js";
import dotenv from "dotenv";

dotenv.config();

export const registerService = async (userData, domain, protocol) => {
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

  // send email to the user
  const verificationLink = `${protocol}://${domain}${process.env.BASE_URL}/auth/verify/${email}`;
  const subject = "Account Verification";
  const text = `Click the button below to verify your account:`;
  const html = `
    <h1>Account Verification</h1>
    <p>Click the button below to verify your account:</p>
    <a href="${verificationLink}">
      <button>Verify Account</button>
    </a>
  `;

  await sendEmail(email, subject, text, html);

  return { username, email };
};

export const loginService = async (userData) => {
  const { email, password, isVerified } = userData;

  // check if the user already exists using mongoose
  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new createCustomError("Invalid Email!", 401, null);
  }

  // check if the account is verified
  if (!existedUser.isVerified) {
    throw new createCustomError("Account is not verified!", 401, null);
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

export const verifyEmailService = async (email) => {
  // check if the user already exists using mongoose
  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new createCustomError("Email Not Found!", 404, null);
  }

  existedUser.isVerified = true;

  await existedUser.save();
};
