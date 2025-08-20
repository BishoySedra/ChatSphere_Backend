import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

/**
 * Array to store logged in users with their socket IDs
 * @type {Array<{email: string, socketId: string[]}>}
 */
export let loggedInUsers = [];

let io;

/**
 * Add a user to the logged in users list
 * @param {string} email - User's email
 * @param {string} socketId - Socket ID
 */
const addLoggedInUser = (email, socketId) => {
  const user = loggedInUsers.find(user => user.email === email);
  
  if (user) {
    if (!user.socketId.includes(socketId)) {
      user.socketId.push(socketId);
    }
  } else {
    loggedInUsers.push({ email, socketId: [socketId] });
  }
};

/**
 * Remove a user from the logged in users list
 * @param {string} email - User's email
 * @param {string} socketId - Socket ID to remove
 */
const removeLoggedInUser = (email, socketId) => {
  const user = loggedInUsers.find(user => user.email === email);
  
  if (user) {
    user.socketId = user.socketId.filter(id => id !== socketId);
  }
};

/**
 * Send data to online receivers via socket
 * @param {Object} data - Data to send
 * @param {string} currentlyOnlineEmail - Email of the receiver
 * @param {string} eventName - Socket event name
 */
export const sendToOnlineReceivers = (data, currentlyOnlineEmail, eventName) => {
  const receiverData = loggedInUsers.find(user => user.email === currentlyOnlineEmail);
  
  if (receiverData) {
    receiverData.socketId.forEach((receiverSocket) => {
      io.to(receiverSocket).emit(eventName, data);
    });
  }
};


/**
 * Initialize socket connection and handle socket events
 * @param {Object} server - HTTP server instance
 */
export const socketConnection = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL, 
        "http://localhost:3000", 
        `http://localhost:${process.env.PORT || 3000}`
      ],
    },
  });

  io.on("connection", (socket) => {
    // Handle successful login event
    socket.on("successfulLogin", ({ email }) => {
      addLoggedInUser(email, socket.id);
    });

    // Handle successful logout event
    socket.on("successfulLogout", ({ email }) => {
      removeLoggedInUser(email, socket.id);
    });

    // Handle disconnect event
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