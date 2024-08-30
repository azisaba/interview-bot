const { Client } = require("discord.js")
const db = require("../utils/db");

/**
 * @param {Client}client
 */
module.exports = (client)=>{
    client.on("guildCreate\n", async guild => {
        if(guild.id !== process.env.SUPPORT_GUILD_ID) return;

        const bot_role = guild.members.me.roles.botRole;

        db.execute(`UPDATE permissions SET "target_id" = ? WHERE permissions.group LIKE ?`, [bot_role.id, "bot"])
    });
}
