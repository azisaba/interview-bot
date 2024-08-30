const { TextChannel } = require("discord.js")
const ChannelOperation = require("../utils/channel")
const Setting = require("../setting")
const db = require("../utils/db")
const { ErrorMessage } = require("../utils/error_message")


/**
 *
 * @param {TextChannel}target_channel
 * @return {Promise<TextChannel>}
 * @throws {ErrorMessage}
 */
const move_archive_category = async (target_channel)=>{
    const res = await db.get_first(`SELECT state FROM channels WHERE channel_id LIKE ?`, [target_channel.id])
    console.log(res)
    if(!res) throw new ErrorMessage('チャンネルが存在しません。');
    if(res.state === "inactive") throw new ErrorMessage('チャンネルは既にアーカイブされています。');
    console.log(res.state === "inactive")
    db.execute(`UPDATE channels SET state='inactive' WHERE channels.channel_id LIKE ?`, [target_channel.id])

    const archive_category_id = await db.get_first(`SELECT value FROM setting_values WHERE key LIKE ?`,
        [Setting.setting_value.ARCHIVE_INTERVIEW_CHANNEL_CATEGORY_ID]
    )

    const archive_category = await target_channel.guild.channels.fetch(archive_category_id.value)

    return await ChannelOperation.move_channel(target_channel, archive_category)
}

exports.move_archive_category = move_archive_category
