// Core modules
import http from "http";

// Third-party modules
import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

// Application helpers and utilities
import { configureEnvironmentVariable } from "./src/helpers/enviroment.js";
import fileUpload from "./src/helpers/multer.js";
import { socketConnection } from "./src/helpers/sockets.js";

// Database connection
import connectDB from "./src/db/connection.js";

// Middleware
import errorHandler from "./src/middlewares/errors/errorHandler.js";
import notFoundHandler from "./src/middlewares/errors/notFoundHandler.js";

// Routes
import authRoutes from "./src/routes/auth.js";
import profileRoutes from "./src/routes/profile.js";
import friendRoutes from "./src/routes/friend.js";
import chatRoutes from "./src/routes/chat.js";
import messageRoutes from './src/routes/message.js';

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app = new Express();

// Define allowed origins for CORS
const DEPLOYMENT_API_URL = process.env.DEPLOYMENT_API_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const allowedOrigins = [CLIENT_URL, DEPLOYMENT_API_URL, "http://localhost:3000"];

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(Express.json());

// Middleware for handling file uploads (e.g., image messages)
app.use(fileUpload.single("imageMessage"));

// Swagger configuration for API documentation
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ChatSphere API Documentation",
      version: "1.0.0",
      description: "API documentation for ChatSphere, a chat application.",
    },
    servers: [
      {
        url: `${DEPLOYMENT_API_URL}${process.env.BASE_URL}`, // Use the base URL from environment variables
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the route files
};

// Initialize Swagger documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define application routes
app.use(`${process.env.BASE_URL}/profile`, profileRoutes);
app.use(`${process.env.BASE_URL}/auth`, authRoutes);
app.use(`${process.env.BASE_URL}/users`, friendRoutes);
app.use(`${process.env.BASE_URL}/chats`, chatRoutes);
app.use(`${process.env.BASE_URL}/messages`, messageRoutes);

// Error handling middleware
app.use(errorHandler);
app.use(notFoundHandler);

// Create an HTTP server and start listening on the specified port
const server = http.createServer(app);
try {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    // Configure environment variables and connect to the database
    let env = configureEnvironmentVariable();
    connectDB(env);

    // Log server and Swagger documentation details
    console.log(`Server listening on port ${port}`);
    console.log(`Swagger documentation available at: https://chatsphere-api.onrender.com/docs`);
  });
} catch (error) {
  console.log(error);
}

// Initialize WebSocket connection
socketConnection(server);

// Export the Express app instance
export default app;
