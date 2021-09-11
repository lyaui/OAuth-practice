const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// 從 google 獲取的資訊
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  googleID: {
    type: String,
  },
  date: { type: Date, default: Date.now },
  thumbnail: {
    type: String,
  },
  // Local Login
  email: {
    type: String,
  },
  password: {
    type: String,
    maxLength: 1024, // 經過 hash 會變長
  },
});

const User = model('User', userSchema);

module.exports = User;
