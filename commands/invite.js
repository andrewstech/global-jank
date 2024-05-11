const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite the bot to your server!"),
    async execute(interaction) {
        // make button
        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Invite")
            .setURL("https://discord.com/oauth2/authorize?client_id=1238816127703056425&permissions=689879510080&scope=bot");

        // make action row
        const actionRow = new ActionRowBuilder().addComponents(button);

        // reply with button
        await interaction.reply({
            content: "Invite me to your server!",
            components: [actionRow],
        });
    },
};