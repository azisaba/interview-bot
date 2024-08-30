const { Client, CategoryChannel, PermissionsBitField, OverwriteData, TextChannel, User,Collection, EmbedBuilder} = require("discord.js")
const ChannelOperation = require("../utils/channel")
const Setting = require("../setting")
const db = require("../utils/db")
const Group = require("../utils/group")
const ControllingChannelState = require("../utils/controlling_channel_state")
const { ErrorMessage, ErrorCode } = require("../utils/error_message")

/**
 *
 * @param {Client}client
 * @param {User}interviewee
 * @param {string}target_group
 * @return {Promise<TextChannel|ErrorMessage>}
 */
const create_interview_channel = async (client, interviewee, target_group)=>{
    const parent_category_id = await Setting.get_value(Setting.setting_value.INTERVIEW_CATEGORY_ID)

    /**
     * @type {CategoryChannel | DMChannel | PartialDMChannel | PartialGroupDMChannel | NewsChannel | StageChannel | TextChannel | PublicThreadChannel<boolean> | PrivateThreadChannel | VoiceChannel | ForumChannel | MediaChannel | ErrorMessage}
     */
    const parent_category = await client.channels.fetch(parent_category_id)
        .catch(e=>{
            return new ErrorMessage(ErrorCode.FailToGetCategory,`カテゴリの取得に失敗しました。\nMessage:\`\`\`${e}\`\`\``)
        })

    if(parent_category instanceof ErrorMessage) return parent_category;


    let target_group_sign = await Group.get_sign(target_group,"nd")

    const permissions_record= []
    permissions_record.push(...(await db.get_all(`SELECT target_id, permission, action, type FROM permissions WHERE "group" LIKE ?`, ["bot"])))
    permissions_record.push(...(await db.get_all(`SELECT target_id, permission, action, type FROM permissions WHERE "group" LIKE ?`, ["common"])))
    permissions_record.push(...(await db.get_all(`SELECT target_id, permission, action, type FROM permissions WHERE "group" LIKE ?`, [target_group_sign])))

    const interviewee_permission_record = (
        await db.get_all(`SELECT target_id, permission, action, type FROM permissions WHERE "group" LIKE 'interviewee'`)
    ).map(v=>{
        v["target_id"] = interviewee.id
        return v
    })
    permissions_record.push(...interviewee_permission_record)


    const permission_building_object = new Collection();

    permissions_record.forEach(v=>{
        const obj = permission_building_object.has(v["target_id"]) ?
            permission_building_object.get(v["target_id"]):
            {
                id: v["target_id"],
                type: v["type"],
                allow: [],
                deny: []
            };

        //obj[action].push(v["permission"])
        if(v["action"]==="allow") obj.allow.push(v["permission"])
        if(v["action"]==="deny") obj.deny.push(v["permission"])

        permission_building_object.set(v["target_id"], obj)
    })

    /**
     * @type {OverwriteData[]}
     */
    const permissions = Array.from(permission_building_object.values())

    const time = Math.floor(Date.now()/10000)

    try{
        const channel = await ChannelOperation.creare(
            client,
            `${interviewee.displayName}さん｜${target_group_sign}${time}`,
            parent_category,
            "",
            permissions,
            0
        )

        const embed = new EmbedBuilder()
            .setDescription(await Setting.get_value(Setting.setting_value.INTERVIEW_CHANNEL_ANNOUNCEMENT_MESSAGE))
            .setColor('#e2b4ee')
            .setTimestamp()

        await channel.send({embeds: [embed]})

        db.execute(`INSERT INTO channels(channel_id, state) VALUES (?,?)`, [channel.id, ControllingChannelState.ACTIVE])

        return channel
    }catch (e){
        return new ErrorMessage(ErrorCode.FailToCreateChannel,`チャンネルの作成に失敗しました。\nMessage:\`\`\`${e}\`\`\``)
    }
}

exports.create_interview_channel = create_interview_channel
