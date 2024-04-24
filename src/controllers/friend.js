import * as FriendService from "../services/friend.js";
import { authorize } from "../middlewares/validator/authorize.js";

// // search friend by email
// export const searchFriendByEmail = (req, res, next) => {
//   try {
//     const foundFriend = FriendService.searchFriendByEmail(
//       req.params.email
//     );

//     res.send({ message: "Friend found", body: foundFriend, status: 200 });
//   } catch (error) {
//     next(error)
//   }
// };

// send friend request
export const sendFriendRequest = async (req, res, next) => {
  try {
    let senderEmail = req.params.sender
    let receiverEmail = req.params.receiver
    await FriendService.validateEmails(senderEmail,receiverEmail)
    await authorize(req,res,next,senderEmail)
    await FriendService.sendFriendRequest(senderEmail,receiverEmail);
    
    return res.send({ message: "Friend request sent succesfully!", status: 200, body: null });
  } catch (error) {
    next(error)
  }
};

// respond to friend request
export const respondToFriendRequest = async (req, res, next) => {
  try {
    let senderEmail = req.params.sender
    let receiverEmail = req.params.receiver
    await FriendService.validateEmails(senderEmail,receiverEmail)
    await authorize(req,res,next,receiverEmail)
    let message = await FriendService.respondToFriendRequest(senderEmail,receiverEmail,req.body.status);
    return res.send({ message, status: 200, body: null });
  } catch (error) {
    next(error)
  }
};

// get all friends of a user
export const getAllFriends = (req, res, next) => {
  try {
    const friends = FriendService.getAllFriends(req.params.email);
    return res.send({ message: "Friends of user retreived succesfully!", status: 200, body: friends });
  } catch (error) {
    next(error)
  }
};

export const unfriend = async (req,res,next) => {
  try{
    let email = req.params.email
    let friendEmail = req.params.friendEmail
    await authorize(req,res,next,email)
    await FriendService.unfriend(email,friendEmail)   
    return res.json({
      body: null,
      status: 200,
      message: "Unfriended successfully",
    });
  }catch(error){
    next(error)
  }
}

export const cancelFriendRequest = async (req,res,next) => {
  try{
    let senderEmail = req.params.sender
    let receiverEmail = req.params.receiver
    await FriendService.validateEmails(senderEmail,receiverEmail)
    await authorize(req,res,next,senderEmail)
    await FriendService.cancelFriendRequest(senderEmail,receiverEmail)
    return res.json({
      body: null,
      status: 200,
      message: "Friend request cancelled successfully",
    });
  }catch(error){
    next(error)
  }
}