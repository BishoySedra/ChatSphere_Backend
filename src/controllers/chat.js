//create the controller stuff using import not require
import User from "../db/models/user.js";
import { authorize } from "../middlewares/validator/authorize.js";
import * as chatService from "../services/chat.js";
import { createCustomError } from "../middlewares/errors/customError.js";
//get all chats that the email is in chatController.getUserPrivateChats
export const getUserPrivateChats = async (req, res,next) => {
  //make this call the get user private chats service
  try{
    const { email } = req.params;
    await authorize(req,res,next,email)
    let chats = await chatService.getUserPrivateChats(email)
    return res.send({ message: "Private chats of user retreived succesfully!", status: 200, body: chats });
  }catch(err){
    next(err)
  }
}

//get all group chats that the email is in chatController.getUserGroupChats
export const getUserGroupChats = async (req, res,next) => {
  //make this call the get user group chats service
  try{
    const { email } = req.params;
    await authorize(req,res,next,email)
    let chats = await chatService.getUserGroupChats(email)
    return res.send({ message: "Group chats of user retreived succesfully!", status: 200, body: chats });
  }catch(err){
    next(err)
  }
}

export const createGroupChat = async (req, res,next) => {
  try{
    const { adminEmail,groupName,groupDescription } = req.body;
    let user = await User.findOne({ email : adminEmail } );
    if(!user)
      throw createCustomError("User not found!", 404, null);
    await authorize(req,res,next,adminEmail)
    await chatService.createGroupChat(adminEmail,groupName,groupDescription)
    return res.send({ body : null, message: "Group chat created succesfully!", status: 200 });
  }catch(err){
    next(err)
  }
}

export const addUserToGroupChat = async (req, res,next) => {
  try{
    const { adminEmail,userEmail, chatID } = req.body;
    await authorize(req,res,next,adminEmail)
    await chatService.addUserToGroupChat(adminEmail,userEmail, chatID)
    return res.send({ body : null, message: "User added to group chat succesfully!", status: 200 });
  }catch(err){
    next(err)
  }
}