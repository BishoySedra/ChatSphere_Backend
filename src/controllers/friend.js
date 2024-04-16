import * as FriendService from "../services/friend.js";

// search friend by email
export const searchFriendByEmail = (req, res, next) => {
  try {
    const foundFriend = FriendService.searchFriendByEmailService(
      req.params.email
    );

    res
      .status(200)
      .json({ message: "Friend found", body: foundFriend, status: 200 });
  } catch (error) {
    console.log(error);
  }
};

// send friend request
export const sendFriendRequest = (req, res, next) => {
  try {
    const request = FriendService.sendFriendRequestService(
      req.params.sender,
      req.params.receiver
    );
    return res
      .status(200)
      .json({ message: "Friend request sent", status: 200, body: null });
  } catch (error) {
    console.log(error);
  }
};

// respond to friend request
export const respondToFriendRequest = (req, res, next) => {
  try {
    const response = FriendService.respondToFriendRequestService(
      req.params.sender,
      req.params.receiver
    );
    return res
      .status(200)
      .json({ message: "Friend request responded", status: 200, body: null });
  } catch (error) {
    console.log(error);
  }
};

// get all friends of a user
export const getAllFriends = (req, res, next) => {
  try {
    const friends = FriendService.getAllFriendsService(req.params.email);
    return res
      .status(200)
      .json({ message: "All friends of a user", status: 200, body: friends });
  } catch (error) {
    console.log(error);
  }
};
