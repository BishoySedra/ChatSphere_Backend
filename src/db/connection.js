import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB(envVariable) {
  try {

    let connection = null;

    if (envVariable === "dev") {
      connection = await mongoose.connect(process.env.MONGODB_CONNECTION_URL_DEV);
      console.log("Connected to MongoDB in development mode!");
    } else if (envVariable === "test") {
      connection = await mongoose.connect(process.env.MONGODB_CONNECTION_URL_TEST);
      console.log("Connected to MongoDB in test mode!");
    } else {
      connection = await mongoose.connect(process.env.MONGODB_CONNECTION_URL_PROD);
      console.log("Connected to MongoDB in production mode!");
    }

  } catch (error) {
    console.log(error);
  }
}

export default connectDB;


async function clearAllCollections(connection) {
  let collections = await connection.listCollections()
  for (let collection of collections) {
    await connection.dropCollection(collection.name)
  }
  console.log("All collections cleared!")
}

export { clearAllCollections };
