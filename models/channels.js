const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
    _id: String, // Channel ID
    guildId: String, // Guild ID
    webhookURL: String, // Webhook URL
});

module.exports = mongoose.model("channel", ChannelSchema, "channel");