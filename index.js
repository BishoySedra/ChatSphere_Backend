import Express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";
import errorHandler from "./src/middlewares/errors/errorHandler.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = new Express();

// Parse JSON bodies (as sent by API clients)
app.use(Express.json());

// define a route handler for the default home page
app.use(`${process.env.BASE_URL}/users`, authRoutes);
app.use(errorHandler);

try {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.log(error);
}
