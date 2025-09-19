const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  text: String,
  delete_password: String,
  created_on: Date,
  reported: { type: Boolean, default: false }
});

const ThreadSchema = new mongoose.Schema({
  board: String,
  text: String,
  delete_password: String,
  created_on: Date,
  bumped_on: Date,
  reported: { type: Boolean, default: false },
  replies: [ReplySchema]
});

module.exports = mongoose.model('Thread', ThreadSchema);
