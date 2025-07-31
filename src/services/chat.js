import mongoose from "mongoose";
import { createCustomError } from "../middlewares/errors/customError.js";
import Chat from "../db/models/chat.js";
import GroupChat from "../db/models/group.chat.js";
import User from "../db/models/user.js";
import { authorizeOnGroup } from "../middlewares/validator/authorize.js";
import * as ProfileService from "./profile.js";

export const getUserPrivateChats = async (email) => {

  // check if email is valid
  const user = await ProfileService.getUser(email);

  // If user is not found, throw a custom error
  if (!user) {
    throw createCustomError("User not found!", 404, null);
  }

  // Find all chats where the user is a participant and the chat type is PRIVATE
  const chats = await Chat.find({
    users: { $in: [email] },
    chat_type: "PRIVATE",
  });

  // If no chats are found, return an empty array
  if (chats.length === 0) {
    return [];
  }

  // For each chat, we can add additional details if needed
  for (let i = 0; i < chats.length; i++) {

    let users = chats[i].users;

    let pushedUser = {
      senderUserName: user.username,
      image_url: user.image_url,
    }

    chats[i].userDetails.push(pushedUser);

    let otherEmail = users.filter((userEmail) => userEmail !== email)[0];
    let otherUser = await ProfileService.getUser(otherEmail);

    pushedUser = {
      receiverUserName: otherUser.username,
      image_url: otherUser.image_url,
    }

    chats[i].userDetails.push(pushedUser);
  }

  return chats;
};

export const createGroupChat = async (
  adminEmail,
  groupName,
  groupDescription = "",
) => {
  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) throw createCustomError("User not found!", 404, null);
  let NewChat = new Chat({
    users: [adminEmail],
    chat_type: "GROUP",
  });
  await NewChat.save();

  let NewGroupChat = new GroupChat({
    chat_id: NewChat._id,
    group_name: groupName,
    group_description: groupDescription,
    admin_email: adminEmail,
  });
  await NewGroupChat.save();
  return NewChat._id;
};

export const addUserToGroupChat = async (adminEmail, userEmail, chatID) => {
  if (!mongoose.isValidObjectId(chatID)) {
    throw createCustomError("Invalid chat id!", 400, null);
  }
  const user = await User.findOne({ email: userEmail });
  const admin = await User.findOne({ email: adminEmail });
  if (!user) throw createCustomError("User not found!", 404, null);
  if (!admin) throw createCustomError("Admin not found!", 404, null);
  //if user not friend of admin then throw a 400
  if (!admin.friends.includes(user.id))
    throw createCustomError("User is not a friend of the admin!", 400, null);
  const chat = await Chat.findOne({ _id: chatID });
  if (!chat) throw createCustomError("Chat not found!", 404, null);
  if (chat.chat_type != "GROUP")
    throw createCustomError("Chat is not a group chat!", 403, null);
  const groupChat = await GroupChat.findOne({ chat_id: chatID });
  if (admin.email != groupChat.admin_email)
    throw createCustomError(
      "You are not the admin of this group chat!",
      403,
      null,
    );
  //check if the user is already in the chat
  if (chat.users.includes(userEmail))
    throw createCustomError("User is already in the chat!", 400, null);
  chat.users.push(userEmail);
  await chat.save();
};


export const getUserGroupChats = async (email, token) => {
  const user = await User.findOne({ email: email });
  if (!user)
    throw createCustomError("User not found!", 404, null);
  const chats = await Chat.find({ users: { $in: [email] }, chat_type: "GROUP" }).lean();
  for (let i = 0; i < chats.length; i++) {
    let groupChat = await getGroupChatDetails(chats[i]._id, token);
    chats[i].groupChatDetails = groupChat;
  }
  return chats;
}


export const getGroupChatDetails = async (id, token) => {
  // check if chat_id is valid mongoose
  if (!mongoose.isValidObjectId(id)) {
    throw createCustomError("Invalid chat id!", 400, null);
  }

  const groupChat = await GroupChat.findOne({ chat_id: id });
  if (!groupChat) throw createCustomError("Group chat not found!", 404, null);
  let chat = await Chat.findOne({ _id: id });
  let groupUsers = chat.users;
  await authorizeOnGroup(token, groupUsers);
  return groupChat;
};

export const deleteGroupChat = async (adminEmail, chatID) => {
  if (!mongoose.isValidObjectId(chatID)) {
    throw createCustomError("Invalid chat id!", 400, null);
  }
  const admin = await User.findOne({ email: adminEmail });
  if (!admin) throw createCustomError("Admin not found!", 404, null);
  const chat = await Chat.findOne({ _id: chatID });
  if (!chat) throw createCustomError("Chat not found!", 404, null);
  if (chat.chat_type != "GROUP")
    throw createCustomError("Chat is not a group chat!", 403, null);
  const groupChat = await GroupChat.findOne({ chat_id: chatID });
  if (admin.email != groupChat.admin_email)
    throw createCustomError(
      "You are not the admin of this group chat!",
      403,
      null,
    );
  await chat.deleteOne();
  await groupChat.deleteOne();
};
