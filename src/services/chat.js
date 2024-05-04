import { createCustomError } from "../middlewares/errors/customError.js";
import Chat from "../db/models/chat.js";
import GroupChat from "../db/models/group.chat.js";
import User from "../db/models/user.js";

export const getUserPrivateChats = async (email) => {
    const user = await User.findOne({ email: email });
    if (!user) 
        throw createCustomError("User not found!", 404, null);
    const chats = await Chat.find({users: { $in : [email] } ,chat_type: "PRIVATE"});
    return chats;
}

export const createGroupChat = async (adminEmail,groupName,groupDescription="") => {
    let adminUser = await User.findOne({ email: adminEmail });
    if(!adminUser)
        throw createCustomError("User not found!", 404, null);
    let NewChat = new Chat({
        users : [adminEmail],
        chat_type : "GROUP"
      })
    await NewChat.save();

    let NewGroupChat = new GroupChat({
        chat_id : NewChat._id,
        group_name : groupName,
        group_description : groupDescription,
        admin_email : adminEmail
    })
    await NewGroupChat.save();
}

export const addUserToGroupChat = async (adminEmail,userEmail, chatID) => {
    const user = await User.findOne({ email: userEmail });
    const admin = await User.findOne({ email: adminEmail });
    if(!user)
        throw createCustomError("User not found!", 404, null);
    if(!admin)
        throw createCustomError("Admin not found!", 404, null);
    //if user not friend of admin then throw a 400
    if(!admin.friends.includes(user.id))
        throw createCustomError("User is not a friend of the admin!", 400, null);
    const chat = await Chat.findOne({ _id: chatID });
    if(!chat)
        throw createCustomError("Chat not found!", 404, null);
    if(chat.chat_type != "GROUP")
        throw createCustomError("Chat is not a group chat!", 403, null);
    const groupChat = await GroupChat.findOne({ chat_id : chatID });
    if(admin.email != groupChat.admin_email)
        throw createCustomError("You are not the admin of this group chat!", 403, null);
    chat.users.push(userEmail);
    await chat.save();
}

export const getUserGroupChats = async (email) => {
    const user = await User.findOne({ email: email });
    if (!user) 
        throw createCustomError("User not found!", 404, null);
    const chats = await Chat.find({users: { $in : [email] } ,chat_type: "GROUP"});
    return chats;
}
