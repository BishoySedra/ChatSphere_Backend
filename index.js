import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { configureEnviromentVariable } from "./src/helpers/enviroment.js";
import errorHandler from "./src/middlewares/errors/errorHandler.js";
import notFoundHandler from "./src/middlewares/errors/notFoundHandler.js";
import authRoutes from "./src/routes/auth.js";
import profileRoutes from "./src/routes/profile.js";
import friendRoutes from "./src/routes/friend.js";
import connectDB from "./src/db/connection.js";

import http from "http";
import { Server } from "socket.io"

// Load environment variables
dotenv.config();

// Create Express app
const app = new Express();


const allowedOrigins = ["http://localhost:3001"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Parse JSON bodies (as sent by API clients)
app.use(Express.json());

// routes
app.use(`${process.env.BASE_URL}/profile`, profileRoutes);
app.use(`${process.env.BASE_URL}/auth`, authRoutes);
app.use(`${process.env.BASE_URL}/users`, friendRoutes);

// Error handling
app.use(errorHandler);
app.use(notFoundHandler);



const server = http.createServer(app);
export const io = new Server(server)

export const loggedInUsers = []//{email: [array of socket ids]}

const addLoggedInUser = (email, socketId) => {
  const user = loggedInUsers.find(user => user.email === email)
  if (user) {
    console.log(user)
    if (!user.socketId.includes(socketId)) {
      user.socketId.push(socketId);
    }
  } else {
    console.log("HERE : " + email + ", " + socketId)
    loggedInUsers.push({ email, socketId: [socketId] })
  }
}

const removeLoggedInUser = (email, socketId) => {
  const user = loggedInUsers.find(user => user.email === email)
  if (user) {
    user.socketId = user.socketId.filter(id => id !== socketId)
  }
}

try {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    let env = configureEnviromentVariable();
    connectDB(env);
    console.log(`Server listening on port ${port}`);
  });
  
} catch (error) {
  console.log(error);
}

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("successfulLogin", ({ email }) => {
    console.log("successful login", email, socket.id)
    addLoggedInUser(email,socket.id)
  })
  socket.on("succesfulLogout", ({ email }) => {
    removeLoggedInUser(email,socket.id)
  });
});

export default app;
