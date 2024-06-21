const mongoose = require('mongoose');
const User = require('./models/User');
const Message = require('./models/Message');
const Poll = require('./models/Poll');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/polling', {
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