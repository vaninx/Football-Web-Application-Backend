
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/FootBall');
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.err('MongoDB connection failed:', err.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectDB;
