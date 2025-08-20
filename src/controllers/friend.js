import * as FriendService from "../services/friend.js";
import { authorize } from "../middlewares/validator/authorize.js";

/**
 * Send a friend request from sender to receiver
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const sendFriendRequest = async (req, res, next) => {
  try {
    const senderEmail = req.params.sender;
    const receiverEmail = req.params.receiver;
    
    await FriendService.validateEmails(senderEmail, receiverEmail);
    await authorize(req, res, next, senderEmail);
    await FriendService.sendFriendRequest(senderEmail, receiverEmail);
    
    return res.send({ 
      message: "Friend request sent successfully!", 
      status: 200, 
      body: null 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Respond to a friend request (accept or reject)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const respondToFriendRequest = async (req, res, next) => {
  try {
    const senderEmail = req.params.sender;
    const receiverEmail = req.params.receiver;
    
    await FriendService.validateEmails(senderEmail, receiverEmail);
    await authorize(req, res, next, receiverEmail);
    
    const message = await FriendService.respondToFriendRequest(
      senderEmail, 
      receiverEmail, 
      req.body.status
    );
    
    return res.send({ message, status: 200, body: null });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all friends of a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAllFriends = async (req, res, next) => {
  try {
    const email = req.params.email;
    
    await authorize(req, res, next, email);
    const friends = await FriendService.getAllFriends(email);
    
    return res.send({ 
      message: "Friends of user retrieved successfully!", 
      status: 200, 
      body: friends 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all pending friend requests for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAllFriendRequests = async (req, res, next) => {
  try {
    const email = req.params.email;
    
    await authorize(req, res, next, email);
    const friendRequests = await FriendService.getAllFriendRequests(email);
    
    return res.send({ 
      message: "Friend requests retrieved successfully!", 
      status: 200, 
      body: friendRequests 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a friend relationship between two users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const unfriend = async (req, res, next) => {
  try {
    const email = req.params.email;
    const friendEmail = req.params.friendEmail;
    
    await authorize(req, res, next, email);
    await FriendService.unfriend(email, friendEmail);
    
    return res.json({
      body: null,
      status: 200,
      message: "Unfriended successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a pending friend request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const cancelFriendRequest = async (req, res, next) => {
  try {
    const senderEmail = req.params.sender;
    const receiverEmail = req.params.receiver;
    
    await FriendService.validateEmails(senderEmail, receiverEmail);
    await authorize(req, res, next, senderEmail);
    await FriendService.cancelFriendRequest(senderEmail, receiverEmail);
    
    return res.json({
      body: null,
      status: 200,
      message: "Friend request cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};
