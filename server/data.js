const mongoose = require('mongoose');
const User = require('./models/User');
const Message = require('./models/Message');
const Poll = require('./models/Poll');
require('dotenv').config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_CONNECTION_STRING;
console.log('MONGO_URI:', process.env.MONGO_URI);
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  models: {
    User,
    Message,
    Poll,
  },
};