const { OverwriteType } = require("discord.js")
const db = require("./db")


/**
 * @enum {string}
 */
const PermissionActions = {
    ALLOW: "allow",
    DENY: "deny",
    NONE: "none"
}

/**
 * @enum {string}
 */
const PermissionNodes = {
    All: "All",
    ExistAll: "ExistAll",
    AddReactions: "AddReactions",
    AttachFiles: "AttachFiles",
    CreateInstantInvite: "CreateInstantInvite",
    CreatePrivateThreads: "CreatePrivateThreads",
    CreatePublicThreads: "CreatePublicThreads",
    EmbedLinks: "EmbedLinks",
    ManageChannels: "ManageChannels",
    ManageMessages: "ManageMessages",
    ManageRoles: "ManageRoles",
    ManageThreads: "ManageThreads",
    ManageWebhooks: "ManageWebhooks",
    MentionEveryone: "MentionEveryone",
    ReadMessageHistory: "ReadMessageHistory",
    SendMessages: "SendMessages",
    SendMessagesInThreads: "SendMessagesInThreads",
    SendPolls: "SendPolls",
    SendTTSMessages: "SendTTSMessages",
    SendVoiceMessages: "SendVoiceMessages",
    UseApplicationCommands: "UseApplicationCommands",
    UseExternalApps: "UseExternalApps",
    UseExternalEmojis: "UseExternalEmojis",
    UseExternalStickers: "UseExternalStickers",
    ViewChannel: "ViewChannel",
}

/**
 *
 * @return {{name:string, value:string}[]}
 */
const get_permission_node_command_choices_format = () => {
    const choice_format = []
    for(let key in PermissionNodes){
        choice_format.push({name: key, value: key})
    }
    return choice_format;
}

/**
 *
 * @param {PermissionNodes}permission
 * @param {PermissionActions}action
 * @param {string}group
 * @param {string}[target_id]
 * @param {OverwriteType.Role | OverwriteType.Member}[type]
 */
const set_permission = async (permission, action,group, target_id, type)=>{
    const records = await db.get_all(`SELECT * FROM permissions WHERE "group" LIKE ? AND permission LIKE ?`, [group, permission])

    if(records.length===0 && action!==PermissionActions.NONE){
        db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
            [target_id, permission, action, type, group]
        )
    } else if(records.length>0 && action!==PermissionActions.NONE){
        db.execute(`UPDATE permissions SET target_id=?, action=?, type=? WHERE "group"  LIKE ? AND permission LIKE ?`,
            [target_id, action, type, group, permission]
        )
    } else if(records.length>0 && action===PermissionActions.NONE){
        db.execute(`DELETE FROM permissions WHERE "group" LIKE ? AND permission LIKE ?`, [group, permission])
    }
}

/**
 *
 * @param {PermissionActions}action
 * @param {string}group
 * @param {string}[target_id]
 * @param {OverwriteType.Role | OverwriteType.Member}[type]
 */
const set_exist_permissions = async (action, group, target_id, type)=>{
    const records = await db.get_all(`SELECT * FROM permissions WHERE "group" LIKE ?`, [group])

    return records.map(v=>{
        db.execute(`UPDATE permissions SET target_id=?, action=?, type=? WHERE "group" LIKE ?`,
            [target_id?target_id:v.target_id, action, type||type===0?type:v.type, group]
        )
        return {target_id: target_id?target_id:v.target_id, permission: v.permission, action: action, type: type?type:v.type, group:group}
    })
}

/**
 *
 * @param {string}origin_group
 * @param {string}target_group
 * @param {string}target_id
 * @param {OverwriteType}target_type
 */
const clone_permissions = async (origin_group, target_group, target_id, target_type)=>{
    const records = await db.get_all(`SELECT * FROM permissions WHERE "group" LIKE ? `, [origin_group])

    await db.query(`DELETE FROM permissions WHERE "group" LIKE ?`, [target_group])

    return records.map(v=>{
        db.execute(`INSERT INTO permissions(target_id, permission, action, type, "group") VALUES (?,?,?,?,?)`,
            [target_id, v.permission, v.action, target_type, target_group]
        )
        return {target_id: target_id, permission: v.permission, action: v.action, type: target_type, group:target_group}
    })
}

exports.PermissionActions = PermissionActions
exports.PermissionNodes = PermissionNodes
exports.get_permission_node_command_choices_format = get_permission_node_command_choices_format
exports.set_permission = set_permission
exports.set_exist_permissions = set_exist_permissions
exports.clone_permissions = clone_permissions

