import User from "../db/models/user.js";
import Chat from "../db/models/chat.js";
import { Message } from "../db/models/message.js";
import { createCustomError } from "../middlewares/errors/customError.js";
import * as sockets from "../helpers/sockets.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

export const sendMessage = async (
  senderEmail,
  chatID,
  message,
  imageBuffer,
  isReply = false,
  replyTo = null,
) => {

  // check if the sender exists in the database
  let senderUser = await User.findOne({ email: senderEmail });

  if (!senderUser) {
    throw createCustomError("User not found!", 404, null);
  }

  // find all chats that this user is in CHATS
  let userChats = await Chat.find({ users: { $in: [senderEmail] } });

  // check if the chat id is in the user chats if not then throw a 403
  let chat = await Chat.findOne({ _id: chatID });
  if (!chat) {
    throw createCustomError("Chat not found!", 404, null);
  }
  //how to check if a chat is inside user chats
  let flag = false;
  userChats.forEach((element) => {
    if (element._id == chatID) {
      flag = true;
    }
  });
  if (!flag) {
    throw createCustomError("You are not in this chat!", 403, null);
  }

  //create new message and add it to the chat
  let newMessage = new Message({ text: message, sender_email: senderEmail });
  if (imageBuffer) {
    let result = await uploadFile(imageBuffer);
    newMessage.imageUrl = result.secure_url;
  }

  // check if is_reply is true and reply_to is provided
  if (isReply && replyTo) {

    // check if the reply_to (olf message id) exists in the chat messages
    let oldMessage = chat.messages.find((msg) => msg._id == replyTo);

    if (!oldMessage) {
      throw createCustomError("Reply message not found!", 404, null);
    }

    newMessage.is_reply = true;
    newMessage.reply_to = oldMessage._id;

    newMessage.reply_to_text = {
      text: oldMessage.text,
      imageUrl: oldMessage.imageUrl,
    };

  } else {
    newMessage.is_reply = false;
    newMessage.reply_to = null;
  }

  // save the new message
  await newMessage.save();

  console.log("new message ", newMessage);

  //console.log("new message ", newMessage);
  let messageID = newMessage._id.toString();
  chat.messages.push(newMessage);
  await chat.save();

  let toBeSentMessage = chat.messages.find(
    (message) => message._id == messageID,
  );

  let receiversEmails = chat.users.filter((user) => user != senderEmail);

  receiversEmails.forEach((receiverEmail) => {
    sockets.sendToOnlineReceivers(
      { toBeSentMessage, chatID },
      receiverEmail,
      "receivedMessage",
    );
  });

  return toBeSentMessage;
};

export const uploadFile = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(imageBuffer).pipe(stream);
  });
};

export const deleteMessage = async (senderEmail, chatID, messageID) => {
  let senderUser = await User.findOne({ email: senderEmail });
  if (!senderUser) throw createCustomError("User not found!", 404, null);
  //find all chats that this user is in CHATS
  let userChats = await Chat.find({ users: { $in: [senderEmail] } });
  //check if the chat id is in the user chats if not then throw a 403
  let chat = await Chat.findOne({ _id: chatID });
  if (!chat) throw createCustomError("Chat not found!", 404, null);
  //how to check if a chat is inside user chats
  let flag = false;
  userChats.forEach((element) => {
    if (element._id == chatID) flag = true;
  });
  if (!flag) throw createCustomError("You are not in this chat!", 403, null);
  //check if the message id is in the chat messages if not then throw a 404
  let toBeDeletedMessage = chat.messages.find(
    (message) => message._id == messageID,
  );
  if (!toBeDeletedMessage)
    throw createCustomError("Message not found!", 404, null);
  if (
    toBeDeletedMessage.sender_email != senderEmail &&
    chat.chat_type == "PRIVATE"
  )
    throw createCustomError(
      "You are not allowed to delete this message!",
      403,
      null,
    );
  if (chat.chat_type == "GROUP" && chat.admin_email != senderEmail)
    throw createCustomError(
      "You are not allowed to delete this message!",
      403,
      null,
    );
  //delete the message
  chat.messages = chat.messages.filter((message) => message._id != messageID);
  await chat.save();
};

const findMessageById = async (messageID) => {
  let message = await Message.findById(messageID).select("-__v -createdAt -updatedAt");
  if (!message) {
    throw createCustomError("Message not found!", 404, null);
  }
  return message;
}
