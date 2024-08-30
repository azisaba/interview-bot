const { Client, CategoryChannel, GuildChannel, OverwriteData, TextChannel } = require("discord.js")
const { ChannelType } = require("discord-api-types/payloads/v10")

/**
 * Create a text channel.
 * @param {Client} client
 * @param {string} channel_name
 * @param {CategoryChannel} parent_channel
 * @param {string} topic
 * @param {OverwriteData[]} permissions
 * @param {number} position
 *
 * @return {Promise<TextChannel>}
 */
const create = async (client, channel_name, parent_channel, topic,permissions, position)=>{
    const guild = await client.guilds.fetch(process.env.SUPPORT_GUILD_ID)

    return guild.channels.create({
        name: channel_name,
        type: ChannelType.GuildText,
        topic: topic,
        parent: parent_channel,
        position: position,
        permissionOverwrites: permissions
    });
}

/**
 * Move a text channel to other category.
 * @param {TextChannel}channel
 * @param {CategoryChannel}parent_channel
 * @param {Object}[option]
 * @return {Promise<TextChannel>}
 */
const move_channel = async (channel, parent_channel, option={lockPermissions: false}) => {
    return await channel.setParent(parent_channel, option)
}

exports.creare = create;
exports.move_channel = move_channel;
