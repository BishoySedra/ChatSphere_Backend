import User from "../db/models/user.js";
import {createCustomError} from "../middlewares/errors/customError.js"


export const getAllUsers = async () => {
    const users = await User.find();
    return users;
};

export const getUser = async (email) => {
    const user = await User.findOne({email:email})
    if (!user) {
        throw createCustomError("Email not found!",404,null);
    }
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
}

export const changeUsernameByEmail = async (email, newUsername) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createCustomError("Email not found!",404,null);
    }
    user.username = newUsername;
    await user.save()
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
};

