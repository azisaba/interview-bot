const { TextChannel } = require("discord.js")
const ChannelOperation = require("../utils/channel")
const Setting = require("../setting")
const db = require("../utils/db")
const ControllingChannelState = require("../utils/controlling_channel_state")
const { ErrorMessage, ErrorCode } = require("../utils/error_message")


/**
 *
 * @param {TextChannel}target_channel
 * @param {ControllingChannelState}state
 * @return {Promise<TextChannel>}
 * @throws {ErrorMessage}
 */
const add_controlling_channel = async (target_channel, state)=>{
    const res = await db.get_first(`SELECT state FROM channels WHERE channel_id LIKE ?`, [target_channel.id])

    if(res) throw new ErrorMessage(ErrorCode.ExistChannel,'既にチャンネルが存在します。');

    db.execute(`INSERT INTO channels(channel_id, state) VALUES (?,?)`, [target_channel.id, state])
}

exports.add_controlling_channel = add_controlling_channel
