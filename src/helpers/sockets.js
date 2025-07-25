import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
export let loggedInUsers = []//{email: [array of socket ids]}
let io


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
      origin: [process.env.CLIENT_URL, "http://localhost:3000"]
    },
  });
  io.on("connection", (socket) => {

    socket.on("successfulLogin", ({ email }) => {
      addLoggedInUser(email, socket.id);
    });
    socket.on("succesfulLogout", ({ email }) => {
      removeLoggedInUser(email, socket.id);
    });
    socket.on("disconnect", () => {
      loggedInUsers = loggedInUsers
        .map((user) => {
          user.socketId = user.socketId.filter((id) => id !== socket.id);
          return user;
        })
        .filter((user) => user.socketId.length > 0);
    });
  });
};