import io from "socket.io-client";
// import FriendRequest from "../icons/FriendRequest";
// import FriendRequestForm from "../screens/FriendRequest";
export const socket = io("http://localhost:3000");

// socket.on("receiveNotification", (data) => {
//     console.log(data);
//     {
//         FriendRequestForm.updateRequestesArray(data.username, data.email);
//     }
// });
