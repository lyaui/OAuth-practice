const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: { type: String },
});

const Post = model('Post', postSchema);

module.exports = Post;
