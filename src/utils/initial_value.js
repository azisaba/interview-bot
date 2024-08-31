const { OverwriteType } = require("discord.js")
const db = require(".//db")
const { PermissionNodes, PermissionActions} = require("./permission")
const setting = require("../setting")


module.exports = ()=>{
    db.execute(`INSERT INTO setting_values(key, value) VALUES (?,?)`,
        [setting.setting_value.INTERVIEW_CHANNEL_ANNOUNCEMENT_MESSAGE,
            `こんにちは、{interviewee}さん！アジ鯖運営の面接にお越しいただきありがとうございます。\n
            面接は、このチャンネル({channel})で、{group}の担当者が行います。\n\n
            最初に、「MCID」、「年齢」、「現職」(学生or社会人)をご記入いただき、担当者からのメッセージをお待ちください。\n\n
            担当者は面接日と時間の記入を分かりやすい形で必ず行ってください\n例: 2023/01/01 00:00:00 面接開始`
        ]
    )

    //https://discord-api-types.dev/api/discord-api-types-payloads/common#Variables

    //"interviewee"
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.AddReactions, PermissionActions.ALLOW, OverwriteType.Member, "interviewee"]
    )
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.AttachFiles, PermissionActions.ALLOW, OverwriteType.Member, "interviewee"]
    )
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.CreatePrivateThreads, PermissionActions.DENY, OverwriteType.Member, "interviewee"]
    )
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.CreatePublicThreads, PermissionActions.DENY, OverwriteType.Member, "interviewee"]
    )
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.ReadMessageHistory, PermissionActions.ALLOW, OverwriteType.Member, "interviewee"]
    )
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.SendMessages, PermissionActions.ALLOW, OverwriteType.Member, "interviewee"]
    )
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.UseApplicationCommands, PermissionActions.DENY, OverwriteType.Member, "interviewee"]
    )
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.UseExternalApps, PermissionActions.DENY, OverwriteType.Member, "interviewee"]
    )
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.UseExternalEmojis, PermissionActions.DENY, OverwriteType.Member, "interviewee"]
    )
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.UseExternalStickers, PermissionActions.DENY, OverwriteType.Member, "interviewee"]
    )
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.ViewChannel, PermissionActions.ALLOW, OverwriteType.Member, "interviewee"]
    )

    //bot
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.SendMessages, PermissionActions.ALLOW, OverwriteType.Role, "bot"]
    )
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.ViewChannel, PermissionActions.ALLOW, OverwriteType.Role, "bot"]
    )

    //group default
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.SendMessages, PermissionActions.ALLOW, OverwriteType.Role, "default"]
    )
    db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
        ["", PermissionNodes.ViewChannel, PermissionActions.ALLOW, OverwriteType.Role, "default"]
    )

    db.execute(`INSERT INTO groups(sign, name) VALUES (?,?)`, ["df", "default"])
}
