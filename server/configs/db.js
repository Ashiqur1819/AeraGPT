import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/aeraGPT`);
    console.log("Database connected!");
  } catch (error) {
    console.log(`ERROR: ${error.message}`);
  }
};

export default connectDB;
