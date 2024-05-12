const channelModel = require("../models/channels");
const messagesModel = require("../models/messages");
const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const uuid = require("uuid");
const messages = require("../models/messages");
const { Message } = require("./main");

async function Reply(message, channels) {
    console.log("Replying to message");
    // get the id of the message that was replied to
    const messageID = message.reference.messageId;
    // get the message data from the db
    const messageData = await messagesModel.findOne({
        $or: [
            { messageID: messageID },
            { messagesIDS: { $in: [messageID] } }
        ]
    });
    message.react("👍");
    const ReplyEmbed = new EmbedBuilder()
        .setTitle("Reply")
        .setDescription(message.content)
        .setColor("#FF0000")
        .setTimestamp();

    if (!messageData) return;
    // send a reply to the original message in each channel without webhook
    for (const messageIDS of messageData.messsagesIDS) {
        const channel = channels.find((channel) => channel._id === messageIDS.channelIDS);
        if (!channel) continue;
        const channelObject = await message.client.channels.fetch(channel._id);
        const originalMessage = await channelObject.messages.fetch(messageIDS.messageID);
        originalMessage.reply({
            embeds: [ReplyEmbed]
        });
    }
    
}
    


exports.Reply = Reply;