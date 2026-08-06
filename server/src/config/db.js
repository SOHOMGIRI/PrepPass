import mongoose from "mongoose";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

const connectDB = async () => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(process.env.MONGO_URI.trim(), {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 20000,
      });
      console.log("MongoDB connected successfully");
      return;
    } catch (error) {
      retries++;
      console.error(
        `MongoDB connection attempt ${retries}/${MAX_RETRIES} failed:`,
        error.message
      );

      if (retries >= MAX_RETRIES) {
        console.error(
          "MongoDB connection failed after maximum retries. Server will continue but database operations will fail."
        );
        // Don't exit - let the server start and return proper errors for DB operations
        return;
      }

      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
};

export default connectDB;
