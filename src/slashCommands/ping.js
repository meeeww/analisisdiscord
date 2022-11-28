const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Devuelve el ping"),
    
    async execute(client, interaction, prefix){
        return interaction.reply("pong")

    }
}