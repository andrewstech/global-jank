const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const channelModel = require("../models/channels");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register the channel you wish to use for the bot.")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("The channel you wish to register.")
                .setRequired(true),
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");

       
        // make a webhook in the channel
        const webhook = await channel.createWebhook({
            name: "Global Jank",
            avatar: "https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Meme_Man_on_transparent_background.webp/316px-Meme_Man_on_transparent_background.webp.png"
        })
        // get guild id
        const guildId = interaction.guildId;
        // get channel id
        const channelId = channel.id;
        // get webhook url
        const webhookURL = webhook.url;

        // if guild id is already registered, then delete the entry
        await channelModel.findOneAndDelete({ guildId: guildId });
        

        // save the channel to the database
        await new channelModel({
            _id: channelId,
            guildId: guildId,
            webhookURL: webhookURL,
        }).save();

        await interaction.reply({
            content: `Successfully registered ${channel.toString()}!`,
            ephemeral: true,
        });
    }

};