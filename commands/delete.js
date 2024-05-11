const { ContextMenuCommandBuilder, ApplicationCommandType, Client } = require('discord.js');
const channelModel = require("../models/channels");
const messagesModel = require("../models/messages");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Delete Message')
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        // get the channel id of the message
        const channel = interaction.channel;
        // get the message id of the message
        const message = interaction.targetId;

        
        // check if the channel is registered
        const channelData = await channelModel.findOne({ _id: channel.id });
        if (!channelData) {
            return interaction.reply({
                content: "This channel is not registered with Global Jank.",
                ephemeral: true,
            });
        }    
        // get the message data check with bot the message ID and the array of messages IDS
        const messageData = await messagesModel.findOne({
            $or: [
                { messageID: message },
                { messsagesIDS: { $in: [message] } }
            ]
        });
        if (!messageData) {
            return interaction.reply({
                content: "This message is not registered with Global Jank.",
                ephemeral: true,
            });
        }
        if (messageData.userID !== interaction.user.id) {
            return interaction.reply({
                content: "You are not the author of this message.",
                ephemeral: true,
            });
        }
        // for each message in the messageData, delete the message
        for (const messageID of messageData.messsagesIDS) {
            const message = await channel.messages.fetch(messageID);
            await message.delete();
            console.log(`Deleted message ${messageID}`);
        }
        const orginalMessage = await channel.messages.fetch(messageData.messageID);
        await orginalMessage.delete();
        await messageData.delete();
        await interaction.reply({
            content: "Message deleted!",
            ephemeral: true,
        });
    },

};