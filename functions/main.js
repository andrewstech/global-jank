const channelModel = require("../models/channels");
const messagesModel = require("../models/messages");
const Discord = require("discord.js");
const uuid = require("uuid");
const Reply = require("./reply");


async function Message(message) {
    // if message is empty, return
    if (!message.content) return;
    if (message.author.bot) return;

    let IDS = []
    let CIDS = []

    // Log the message ID

    // send message via webhook in the db to every channel in the db except the one the message was sent in
    const channels = await channelModel.find();
    if (!channels.find((channel) => channel._id === message.channel.id)) return;
    if (message.reference) {
        Reply.Reply(message, channels);
        return;
    }
    for (const channel of channels) {
        if (channel._id === message.channel.id) {
            // react to the message
            message.react("👍");
            continue;
        }
        const webhook = new Discord.WebhookClient({ url: channel.webhookURL });
        let sentMessage = null;
        try {
                sentMessage = await webhook.send({
                content: message.content,
                username: message.author.username,
                avatarURL: message.author.displayAvatarURL(),
                allowedMentions: { parse: [] },
            });
        }
        catch (e) {
            console.log(`Error: ${e}`);
            // remove the channel from the db
            await channelModel.deleteOne({ _id: channel._id });
            continue;
        }
        // log the channel id of the channel the message was sent in

        // Log the ID of the message sent via webhook
        IDS.push(sentMessage.id);
        CIDS.push(channel._id);
    }
    // Save the updated messages model
    // convert IDS to an array
    console.log(`IDS: ${IDS}`);
    let newMessage = new messagesModel({
        _id: uuid.v4(), 
        messageID: message.id,
        userID: message.author.id,
        messsagesIDS: IDS,
        channelIDS: CIDS,
    });
    await newMessage.save();
}

exports.Message = Message;
