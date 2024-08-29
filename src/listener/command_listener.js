const { Client } = require("discord.js")
const fs = require("fs")

/**
 * @param {Client}client
 */
module.exports = (client)=>{
    client.on("interactionCreate", async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`"${interaction.commandName}" is not found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
        }
    });
}
