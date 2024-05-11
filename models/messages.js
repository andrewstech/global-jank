const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
    _id: String, // Random UUID
    messageID: String, // Message ID
    userID: String, // User ID
    messsagesIDS: Array, // Array of messages
});

module.exports = mongoose.model("messages", MessagesSchema, "messages");