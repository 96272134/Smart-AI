const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: String,
  content: String,
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  title: {
    type: String,
    default: "New Chat",
  },

  messages: [messageSchema],

}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);