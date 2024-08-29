//Note: https://qiita.com/narikakun/items/a897104e4bd55ca1e166
const { Client, Collection } = require("discord.js")
const fs = require("fs")
const path = require("path")

/**
 * @param {Client}client
 */
module.exports = async (client)=>{
    const commands = []
    client.commands = new Collection();

    const commands_path = path.join(__dirname, 'commands');
    const command_files =  fs.readdirSync(commands_path).filter(v => v.endsWith('.js'));

    for (const file of command_files) {
        const file_path = path.join(commands_path, file);

        const command = require(file_path);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data)
        } else {
            console.error(`The ${file_path} is missing the required “data” or “execute” property.`);
        }
    }

    await client.application.commands.set(commands, process.env.SUPPORT_GUILD_ID);
}
