import { createCustomError } from "../middlewares/errors/customError.js";
import Chat from "../db/models/chat.js";
import User from "../db/models/user.js";

export const getUserPrivateChats = async (email) => {
    const user = await User.findOne({ email: email });
    if (!user) 
        throw createCustomError("User not found!", 404, null);
    //get all chats that have the email inside users array of the chat model and the chat_type is private
    const chats = await Chat.find({users: { $in : [email] } ,chat_type: "PRIVATE"});
    return chats;
}

export const getUserGroupChats = async (email) => {
    const user = await User.findOne({ email: email });
    if (!user) 
        throw createCustomError("User not found!", 404, null);
    const chats = await Chat.find({users: { $in : [email] } ,chat_type: "GROUP"});

    return chats;
}
