import io from "socket.io-client";
// import FriendRequest from "../icons/FriendRequest";
// import FriendRequestForm from "../screens/FriendRequest";
export const socket = io("https://chatsphere-pjik.onrender.com");

// socket.on("receiveNotification", (data) => {
//     console.log(data);
//     {
//         FriendRequestForm.updateRequestesArray(data.username, data.email);
//     }
// });