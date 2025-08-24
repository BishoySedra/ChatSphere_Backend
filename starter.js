// Core modules
import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

// Application helpers and utilities
import { configureEnvironmentVariable } from "./src/helpers/enviroment.js";
import fileUpload from "./src/helpers/multer.js";
import connectDB from "./src/db/connection.js";
import { socketConnection } from "./src/helpers/sockets.js";

// Middleware
import errorHandler from "./src/middlewares/errors/errorHandler.js";
import notFoundHandler from "./src/middlewares/errors/notFoundHandler.js";
import { generalRateLimiter } from "./src/middlewares/security/rateLimiter.js";
import { sanitizeMiddleware } from "./src/middlewares/security/sanitizer.js";

// Routes
import authRoutes from "./src/routes/auth.js";
import profileRoutes from "./src/routes/profile.js";
import friendRoutes from "./src/routes/friend.js";
import chatRoutes from "./src/routes/chat.js";
import messageRoutes from './src/routes/message.js';

// Load environment variables from .env
dotenv.config();

// Create app instance
const app = new Express();

// Trust proxy for correct IP addresses behind reverse proxy
app.set('trust proxy', 1);

// CORS Configuration
const DEPLOYMENT_API_URL = process.env.DEPLOYMENT_API_URL;
const CLIENT_URL = process.env.CLIENT_URL;

const allowedOrigins = [CLIENT_URL, DEPLOYMENT_API_URL, "http://localhost:3000", `http://localhost:${process.env.PORT || 3000}`];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions));

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

app.use(mongoSanitize()); // Prevent NoSQL injection attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution attacks
app.use(generalRateLimiter); // Apply general rate limiting
app.use(sanitizeMiddleware); // Sanitize inputs to prevent XSS

// Request parsing middleware with size limits
app.use(Express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(Express.urlencoded({ extended: true, limit: '10mb' })); // Limit URL-encoded payload size
app.use(fileUpload.single("imageMessage"));

// Swagger setup

const NODE_ENV = configureEnvironmentVariable();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "ChatSphere API Documentation",
            version: "1.0.0",
            description: "API documentation for ChatSphere, a chat application.",
        },
        servers: NODE_ENV === "dev" || NODE_ENV === "test"
            ? [
                {
                    url: `http://localhost:${process.env.PORT || 3000}${process.env.BASE_URL}`,
                    description: `${NODE_ENV === "test" ? "Test" : "Development"} server`,
                },
            ]
            : [
                {
                    url: `${DEPLOYMENT_API_URL}${process.env.BASE_URL}`,
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
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Route registration
app.use(`${process.env.BASE_URL}/profile`, profileRoutes);
app.use(`${process.env.BASE_URL}/auth`, authRoutes);
app.use(`${process.env.BASE_URL}/users`, friendRoutes);
app.use(`${process.env.BASE_URL}/chats`, chatRoutes);
app.use(`${process.env.BASE_URL}/messages`, messageRoutes);

// Error handling
app.use(errorHandler);
app.use(notFoundHandler);

// Initialization logic
export const initializeServer = async (port, server) => {

    if (!NODE_ENV) {
        throw new Error("Environment variable not set. Cannot start the server.");
    }

    console.log(`Connecting to the database for ${NODE_ENV} environment...`);
    await connectDB(NODE_ENV);

    if (NODE_ENV === "dev" || NODE_ENV === "test") {
        console.log(`Server is running in ${NODE_ENV} mode.`);
        console.log(`→ http://localhost:${port}${process.env.BASE_URL}`);
        console.log(`→ Swagger Docs: http://localhost:${port}/docs`);
    } else {
        console.log("Server is running in production mode.");
        console.log(`→ ${DEPLOYMENT_API_URL}${process.env.BASE_URL}`);
        console.log(`→ Swagger Docs: ${DEPLOYMENT_API_URL}/docs`);
    }

    // WebSocket
    socketConnection(server);
};

export default app;
