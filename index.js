import Express from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Express app
const app = new Express();

try {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.log(error);
}
