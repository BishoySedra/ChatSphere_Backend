import User from "../db/models/user.js";
import { createCustomError } from "../middlewares/errors/customError.js";
import { uploadFile } from "./message.js";


export const getAllUsers = async () => {
    const users = await User.find();
    return users;
};

export const getUser = async (email) => {
    const user = await User.findOne({ email: email })
    if (!user) {
        throw createCustomError("Email not found!", 404, null);
    }
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
}

export const getUsernameByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createCustomError("Email not found!", 404, null);
    }
    return user.username;
}

export const changeUsernameByEmail = async (email, newUsername) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createCustomError("Email not found!", 404, null);
    }
    user.username = newUsername;
    await user.save()
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
};

export const changeImageByEmail = async (email, imageBuffer) => {
    // check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
        throw createCustomError("Email not found!", 404, null);
    }

    // upload the image to cloudinary and get the url
    const result = await uploadFile(imageBuffer);
    user.image_url = result.secure_url;

    // save the user to the database
    await user.save();

    // return the user without password
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
}
