import Express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";
import errorHandler from "./src/middlewares/errors/errorHandler.js";
import connectDB from "./src/db/connection.js";
import cors from "cors";

import { configureEnviromentVariable } from "./src/helpers/enviroment.js"

// Load environment variables
dotenv.config();

// Create Express app
const app = new Express();

const allowedOrigins = ['http://localhost:3001'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

// Parse JSON bodies (as sent by API clients)
app.use(Express.json());

// define a route handler for the default home page
app.use(`${process.env.BASE_URL}/users`, authRoutes);
app.use(errorHandler);


try {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    let env = configureEnviromentVariable()
    connectDB(env);
    console.log(`Server listening on port ${port}`);
  });
} catch (error) {
  console.log(error);
}

export default app;
