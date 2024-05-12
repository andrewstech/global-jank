const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const channelModel = require("../models/channels");
const messagesModel = require("../models/messages");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Delete Message')
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        try {
            const messageID = interaction.targetId;
            const messageData = await messagesModel.findOne({
                $or: [
                    { messageID: messageID },
                    { "messagesIDS.messageID": messageID }
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

            const channel = interaction.channel;

            // Delete the original message
            const originalMessage = await channel.messages.fetch(messageID);
            await originalMessage.delete();
            console.log(`Deleted message ${messageID}`);

            // Check if messagesIDS is an object and delete the associated messages
            if (typeof messageData.messagesIDS === 'object') {
                const otherChannel = await channelModel.findOne({ _id: messageData.messagesIDS.ChannelID });
                if (!otherChannel) {
                    console.error(`Channel ${messageData.messagesIDS.ChannelID} not found.`);
                } else {
                    const otherMessage = await otherChannel.messages.fetch(messageData.messagesIDS.messageID);
                    if (otherMessage) {
                        await otherMessage.delete();
                        console.log(`Deleted message ${messageData.messagesIDS.messageID} in channel ${messageData.messagesIDS.ChannelID}`);
                    } else {
                        console.error(`Message ${messageData.messagesIDS.messageID} not found in channel ${messageData.messagesIDS.ChannelID}`);
                    }
                }
            } else {
                console.error("messagesIDS is not an object");
            }

            // Delete the message document from the database
            await messagesModel.findOneAndDelete({ messageID: messageID });

            await interaction.reply({
                content: "Message deleted!",
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error deleting message:", error);
            await interaction.reply({
                content: "Error deleting message.",
                ephemeral: true,
            });
        }
    }
};
