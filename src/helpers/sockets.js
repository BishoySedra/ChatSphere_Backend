import { Server } from "socket.io";

export let loggedInUsers = []//{email: [array of socket ids]}
let io 


const addLoggedInUser = (email, socketId) => {
  const user = loggedInUsers.find(user => user.email === email)
  if (user) {
    console.log(user)
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

export const sendToOnlineReceivers = (data,currentlyOnlineEmail,eventName) => {
    let receiverData = loggedInUsers.find(user => user.email === currentlyOnlineEmail)
    console.log(receiverData)
    if(receiverData) {
        receiverData.socketId.forEach((receiverSocket) => {
        io.to(receiverSocket).emit(eventName, data)
    })
  }
}


export const socketConnection = (server) => {
    io = new Server(server)
    io.on("connection", (socket) => {
        console.log("New client connected");
        socket.on("successfulLogin", ({ email }) => {
          addLoggedInUser(email,socket.id)
        })
        socket.on("succesfulLogout", ({ email }) => {
          removeLoggedInUser(email,socket.id)
        });
        socket.on("disconnect", () => {
          console.log("Client disconnected");
            loggedInUsers = loggedInUsers.map(user => {
                user.socketId = user.socketId.filter(id => id !== socket.id)
                return user
            }).filter(user => user.socketId.length > 0)
        });
    });
}
