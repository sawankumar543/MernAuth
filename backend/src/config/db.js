import config from './config.js';
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const dbConnection = await mongoose.connect(config.MONGODB_URL);
    
    console.log('MongoDB Connection Succeeded.');
    console.log(`Database connected !! DB HOST: ${dbConnection.connection.host}`);
  } catch (error) {
    console.error('Error in DB connection:', error.message);
    process.exit(1); // Optional: Stop the app if the database fails to connect
  }
};

export default connectDB;
