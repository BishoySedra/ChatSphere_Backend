import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
export let loggedInUsers = []//{email: [array of socket ids]}
let io

console.log(loggedInUsers);

const addLoggedInUser = (email, socketId) => {
  const user = loggedInUsers.find(user => user.email === email)
  if (user) {
    if (!user.socketId.includes(socketId)) {
      user.socketId.push(socketId);
    }
  } else {
    loggedInUsers.push({ email, socketId: [socketId] })
  }
}

const removeLoggedInUser = (email, socketId) => {
  const user = loggedInUsers.find(user => user.email === email)
  if (user) {
    user.socketId = user.socketId.filter(id => id !== socketId)
  }
}

export const sendToOnlineReceivers = (data, currentlyOnlineEmail, eventName) => {
  let receiverData = loggedInUsers.find(user => user.email === currentlyOnlineEmail)
  if (receiverData) {
    receiverData.socketId.forEach((receiverSocket) => {
      io.to(receiverSocket).emit(eventName, data)
    })
  }
}


export const socketConnection = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL, "http://localhost:3000", `http://localhost:${process.env.PORT || 3000}`],
    },
  });
  io.on("connection", (socket) => {

    socket.on("successfulLogin", ({ email }) => {
      addLoggedInUser(email, socket.id);
      console.log(loggedInUsers);

    });

    socket.on("successfulLogout", ({ email }) => {
      removeLoggedInUser(email, socket.id);
      console.log(loggedInUsers);
    });

    socket.on("disconnect", () => {
      loggedInUsers = loggedInUsers
        .map((user) => {
          user.socketId = user.socketId.filter((id) => id !== socket.id);
          return user;
        })
        .filter((user) => user.socketId.length > 0);
    });

    // // Handle message seen event
    // socket.on("messageSeen", ({ chatID, messageID, email }) => {
    //   // Notify other users in the chat that the message has been seen
    //   const user = loggedInUsers.find(user => user.email === email);
    //   if (user) {
    //     user.socketId.forEach((receiverSocket) => {
    //       io.to(receiverSocket).emit("messageSeen", { chatID, messageID });
    //     });
    //   }
    // });

    // // Handle typing status event
    // socket.on("typingStatus", ({ chatID, email, isTyping }) => {
    //   // Broadcast typing status to other users in the chat
    //   const user = loggedInUsers.find(user => user.email === email);
    //   if (user) {
    //     user.socketId.forEach((receiverSocket) => {
    //       io.to(receiverSocket).emit("typingStatus", { chatID, email, isTyping });
    //     });
    //   }
    // });

  });
};