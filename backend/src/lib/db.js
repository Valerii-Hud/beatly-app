import mongoose from 'mongoose';

export const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error on connection to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
