const { TextChannel } = require("discord.js")
const db = require("../utils/db")
const { ErrorMessage, ErrorCode } = require("../utils/error_message")


/**
 *
 * @param {TextChannel}target_channel
 * @throws {ErrorMessage}
 */
const remove_archived_channel = async (target_channel)=>{
    const res = await db.get_first(`SELECT state FROM channels WHERE channel_id LIKE ?`, [target_channel.id])

    if(!res) throw new ErrorMessage(ErrorCode.NotExistChannel,'チャンネルが存在しません。');
    if(res.state === "active") throw new ErrorMessage(ErrorCode.NotArchivedChannel,'チャンネルがアーカイブされていません。');

    db.execute(`DELETE FROM channels WHERE channels.channel_id LIKE ?`, [target_channel.id])

    await target_channel.delete()
}

exports.remove_archived_channel = remove_archived_channel
