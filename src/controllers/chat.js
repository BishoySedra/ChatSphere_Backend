//create the controller stuff using import not require
import { authorize } from "../middlewares/validator/authorize.js";
import * as chatService from "../services/chat.js";
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
    const { email } = req.params;
    authorize(req,res,next,email)
}

