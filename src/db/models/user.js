//id                   UNIQUE
// username   NOT NULL
// email      NOT NULL, UNIQUE
// password   NOT NULL ---> 1 capital , 1 number , 1 small , 1 special , at least 8 total NOTE passwords are to be hashed
// list of user ids (friends)

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image_url: {
    type: String,
    default: null
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
