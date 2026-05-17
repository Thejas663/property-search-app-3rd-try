import mongoose from "mongoose";

const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017/property_search_app";
const MongoDBURL = process.env.MONGODB_URI || DEFAULT_LOCAL_URI;

export const mongoConnect = async () => {
  try {
    await mongoose.connect(MongoDBURL);
    console.log("MongoDB Connected", MongoDBURL);
  } catch (err) {
    console.log("MongoDB connection failed:", err.message);
    if (process.env.MONGODB_URI && MongoDBURL !== DEFAULT_LOCAL_URI) {
      console.log("Trying local MongoDB fallback...");
      try {
        await mongoose.connect(DEFAULT_LOCAL_URI);
        console.log("MongoDB Connected to local fallback", DEFAULT_LOCAL_URI);
        return;
      } catch (localErr) {
        console.log("Local MongoDB fallback failed:", localErr.message);
        throw localErr;
      }
    }
    throw err;
  }
};