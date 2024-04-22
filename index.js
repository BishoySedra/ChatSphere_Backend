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
import { socketConnection } from "./src/helpers/sockets.js";

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

socketConnection(server)

export default {app };
