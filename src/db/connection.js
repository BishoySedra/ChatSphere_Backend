import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB(envVariable) {
  try {
    let connection
    if(envVariable === "dev")
      connection = await mongoose.connect(
        process.env.MONGODB_CONNECTION_URL_DEV
      );
    else if(envVariable === "test"){
      connection = await mongoose.connect(
        process.env.MONGODB_CONNECTION_URL_TEST
      );

      //await clearAllCollections(mongoose.connection)

    }
    else{
      if(!process.env.MONGODB_CONNECTION_URL_LOCAL) 
        throw new Error("No local MongoDB available!")
      connection = await mongoose.connect(
        process.env.MONGODB_CONNECTION_URL_LOCAL
      );
    }
    console.log(`Database for ${envVariable} enviroment Connected successfully!`);
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;


async function clearAllCollections(connection){
  let collections = await connection.listCollections()
  for(let collection of collections){
    await connection.dropCollection(collection.name)
  }
  console.log("All collections cleared!")
}

export { clearAllCollections };
