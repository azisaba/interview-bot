const { Client } = require("discord.js")
const fs = require("fs")
const path = require("path")

/**
 * @param {Client}client
 */
module.exports = (client)=>{
    const listener_path = path.join(__dirname, 'listener');
    const listener_files =  fs.readdirSync(listener_path).filter(v => v.endsWith('.js'));

    for (const file of listener_files) {
        const file_path = path.join(listener_path, file);

        const listener = require(file_path);
        listener(client)
    }
}
