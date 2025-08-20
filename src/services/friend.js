import User from "../db/models/user.js";
import { createCustomError } from "../middlewares/errors/customError.js";
import FriendRequest from "../db/models/friend_request.js";
import Chat from "../db/models/chat.js";
import * as sockets from "../helpers/sockets.js";

/**
 * Search for a friend by email address
 * @param {string} email - The email address to search for
 * @returns {Promise<string>} - Search result message
 * @todo Implement actual search functionality
 */
export const searchFriendByEmail = async (email) => {
  return "search friend by email";
};

/**
 * Send a friend request from sender to receiver
 * @param {string} senderEmail - Email of the person sending the request
 * @param {string} receiverEmail - Email of the person receiving the request
 * @throws {CustomError} - If friend request already exists
 * @returns {Promise<void>}
 */
export const sendFriendRequest = async (senderEmail, receiverEmail) => {
  // Check if friend request already exists in either direction
  const friendRequestExists = await FriendRequest.findOne({ senderEmail, receiverEmail }) 
    || await FriendRequest.findOne({ senderEmail: receiverEmail, receiverEmail: senderEmail });
  
  if (friendRequestExists) {
    throw createCustomError("Friend request already exists!", 400, null);
  }

  const newFriendRequest = new FriendRequest({
    senderEmail,
    receiverEmail
  });
  
  await newFriendRequest.save();
  
  const senderUser = await User.findOne({ email: senderEmail });
  sockets.sendToOnlineReceivers(
    { email: senderEmail, username: senderUser.username }, 
    receiverEmail, 
    "receiveNotification"
  );
};

/**
 * Validate that both users exist and can send friend requests to each other
 * @param {string} senderEmail - Email of the sender
 * @param {string} receiverEmail - Email of the receiver
 * @throws {CustomError} - If users don't exist, are the same, or are already friends
 * @returns {Promise<void>}
 */
export const validateEmails = async (senderEmail, receiverEmail) => {
  const senderUser = await User.findOne({ email: senderEmail });
  const receiverUser = await User.findOne({ email: receiverEmail });
  
  if (!senderUser || !receiverUser) {
    throw createCustomError("User not found!", 404, null);
  }
  
  if (senderEmail === receiverEmail) {
    throw createCustomError("You can't send a friend request to yourself!", 400, null);
  }
  
  const senderFriends = senderUser.friends;
  if (senderFriends.includes(receiverUser._id)) {
    throw createCustomError("You are already friends!", 400, null);
  }
};

/**
 * Respond to a friend request (accept or reject)
 * @param {string} senderEmail - Email of the friend request sender
 * @param {string} receiverEmail - Email of the friend request receiver
 * @param {string} status - Response status ("ACCEPTED" or "REJECTED")
 * @throws {CustomError} - If friend request is not found
 * @returns {Promise<string>} - Response message
 */
export const respondToFriendRequest = async (senderEmail, receiverEmail, status) => {
  const friendRequestExists = await FriendRequest.findOne({ senderEmail, receiverEmail });
  
  if (!friendRequestExists) {
    throw createCustomError("Friend request not found!", 404, null);
  }

  let responseMessage = "Friend request rejected!";
  
  if (status === "ACCEPTED") {
    const senderUser = await User.findOne({ email: senderEmail });
    const receiverUser = await User.findOne({ email: receiverEmail });
    
    // Add users to each other's friend lists
    senderUser.friends.push(receiverUser._id);
    receiverUser.friends.push(senderUser._id);
    
    await senderUser.save();
    await receiverUser.save();
    
    responseMessage = "Friend request accepted!";

    // Notify the sender that their request was accepted
    sockets.sendToOnlineReceivers(
      { email: senderEmail, username: senderUser.username }, 
      senderEmail, 
      "acceptFriendRequest"
    );

    // Create a private chat between the two users if one doesn't exist
    const chatExists = await Chat.findOne({
      users: [senderUser.email, receiverUser.email],
      chat_type: "PRIVATE"
    });

    if (!chatExists) {
      const newChat = new Chat({
        users: [senderUser.email, receiverUser.email],
        chat_type: "PRIVATE"
      });
      await newChat.save();
    }
  }

  // Remove the friend request regardless of acceptance or rejection
  await FriendRequest.deleteOne({ senderEmail, receiverEmail });

  return responseMessage;
};


/**
 * Get all friends of a user
 * @param {string} email - Email of the user
 * @throws {CustomError} - If user is not found
 * @returns {Promise<Array<{email: string, username: string}>>} - Array of friend details
 */
export const getAllFriends = async (email) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw createCustomError("User not found!", 404, null);
  }

  const userFriendsIds = user.friends;
  const friendsDetails = [];
  
  for (const friendId of userFriendsIds) {
    const friend = await User.findById(friendId);
    friendsDetails.push(friend);
  }
  
  return friendsDetails.map(user => ({ email: user.email, username: user.username }));
};

/**
 * Remove a friend relationship between two users
 * @param {string} email - Email of the user removing the friend
 * @param {string} friendEmail - Email of the friend to be removed
 * @throws {CustomError} - If users are not found or are not friends
 * @returns {Promise<void>}
 */
export const unfriend = async (email, friendEmail) => {
  const user = await User.findOne({ email });
  const friendUser = await User.findOne({ email: friendEmail });

  if (!user || !friendUser) {
    throw createCustomError("User not found!", 404, null);
  }

  const userFriends = user.friends;
  const friendFriends = friendUser.friends;

  const friendIndex = userFriends.indexOf(friendUser._id);
  const userIndex = friendFriends.indexOf(user._id);

  if (friendIndex === -1 && userIndex === -1) {
    throw createCustomError("Friend not found!", 404, null);
  }

  // Remove each user from the other's friend list
  userFriends.splice(friendIndex, 1);
  friendFriends.splice(userIndex, 1);

  await user.save();
  await friendUser.save();
};

/**
 * Cancel a pending friend request
 * @param {string} senderEmail - Email of the person who sent the request
 * @param {string} receiverEmail - Email of the person who received the request
 * @throws {CustomError} - If friend request is not found
 * @returns {Promise<void>}
 */
export const cancelFriendRequest = async (senderEmail, receiverEmail) => {
  const friendRequest = await FriendRequest.findOne({ senderEmail, receiverEmail });
  
  if (!friendRequest) {
    throw createCustomError("Friend request not found!", 404, null);
  }
  
  await friendRequest.deleteOne();
};

/**
 * Get all pending friend requests for a user
 * @param {string} email - Email of the user
 * @throws {CustomError} - If user is not found
 * @returns {Promise<Array<{email: string, username: string}>>} - Array of sender details
 */
export const getAllFriendRequests = async (email) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw createCustomError("User not found!", 404, null);
  }

  const friendRequests = await FriendRequest.find({ receiverEmail: email });
  const friendRequestsDetails = [];
  
  for (const request of friendRequests) {
    // Get the name and email of the senders
    const sender = await User.findOne({ email: request.senderEmail });
    friendRequestsDetails.push(sender);
  }
  
  return friendRequestsDetails.map(user => ({ email: user.email, username: user.username }));
};