const channelModel = require("../models/channels");
const Discord = require("discord.js");

async function Message(message) {
    if (message.author.bot) return;
    // send message via webhook in the db to every channel in the db except the one the message was sent in
    const channels = await channelModel.find();
    for (const channel of channels) {
        if (channel._id === message.channel.id) {
            // react to the message
            message.react("👍");
            continue;
        }
        const webhook = new Discord.WebhookClient({ url: channel.webhookURL });
        webhook.send({
            content: message.content,
            username: message.author.username,
            avatarURL: message.author.displayAvatarURL(),
        });
    }
}

exports.Message = Message;

    
    
        