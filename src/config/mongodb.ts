import mongoose from "mongoose";
import config from ".";
import logger from "./winston";

const connectToMongoDB = async () => {
  try {
    const instance = await mongoose.connect(config.MONGODB_URI as string);
    logger.info(
      "Connected to Database: " + instance.connection.db?.databaseName,
    );
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
  }
};

export default connectToMongoDB;
