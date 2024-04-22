import User from "../db/models/user.js";
import { createCustomError } from "../middlewares/errors/customError.js";
import FriendRequest from "../db/models/friend_request.js";

import * as sockets from "../helpers/sockets.js";



export const searchFriendByEmail = async (email) => {
  return "search friend by email";
};

export const sendFriendRequest = async (senderEmail, receiverEmail) => {
  
  let friendRequestExists = await FriendRequest.findOne({senderEmail,receiverEmail}) 
    || await FriendRequest.findOne({senderEmail:receiverEmail,receiverEmail:senderEmail})
  if(friendRequestExists)
    throw createCustomError("Friend request already exists!", 400,null)
  let newFriendRequest = new FriendRequest({
    senderEmail,
    receiverEmail
  });
  await newFriendRequest.save()

  sockets.sendToOnlineReceivers({senderEmail,receiverEmail},receiverEmail,"receiveNotification")
  
};

export const validateEmails = async (senderEmail,receiverEmail)  => {
  let senderUser = await User.findOne({ email: senderEmail });
  let receiverUser = await User.findOne({ email: receiverEmail });
  if(!senderUser || !receiverUser)
    throw createCustomError("User not found!", 404,null)
  if(senderEmail === receiverEmail)
    throw createCustomError("You can't send a friend request to yourself!", 400,null)
  let senderFriends = senderUser.friends
  if(senderFriends.includes(receiverUser._id))
    throw createCustomError("You are already friends!", 400,null)
}

export const respondToFriendRequest = async (senderEmail, receiverEmail,status) => {
  let friendRequestExists = await FriendRequest.findOne({senderEmail,receiverEmail})
  if(!friendRequestExists)
    throw createCustomError("Friend request not found!", 404,null)
 
  let responseMessage = "Friend request rejected!"
  if(status === "ACCEPTED") {
    let senderUser = await User.findOne({ email: senderEmail });
    let receiverUser = await User.findOne({ email: receiverEmail });
    senderUser.friends.push(receiverUser._id)
    receiverUser.friends.push(senderUser._id)
    await senderUser.save()
    await receiverUser.save()
    responseMessage = "Friend request accepted!"


    sockets.sendToOnlineReceivers({senderEmail, receiverEmail},senderEmail,"acceptFriendRequest")
    
  }
  

  await FriendRequest.deleteOne({senderEmail,receiverEmail})

  
  return responseMessage
};


export const getAllFriends = async (email) => {
    let user = await User.findOne({ email })
    if(!user) {
        throw createCustomError("User not found!", 404,null)
    }
    let userFriendsIds = user.friends
    let friendsDetails = await User.find(
               { _id: { $in: userFriendsIds } }
               ,{ email: 1, username: 1 , _id: 1})
    return friendsDetails
};

export const unfriend = async (email, friendEmail) => {
  const user = await User.findOne({ email: email });
  const friendUser = await User.findOne({email: friendEmail})

  if (!user || !friendUser) {
    throw createCustomError("User not found!", 404,null);
  }

  let userFriends = user.friends
  let friendFriends = friendUser.friends

  let friendIndex = userFriends.indexOf(friendUser._id)
  let userIndex = friendFriends.indexOf(user._id)

  if(friendIndex === -1 && userIndex === -1){
    throw createCustomError("Friend not found!", 404,null)
  }

  userFriends.splice(friendIndex,1)
  friendFriends.splice(userIndex,1)

  await user.save()
  await friendUser.save()
}