const { OverwriteType } = require("discord.js")
const { PermissionActions, PermissionNodes, set_permission} = require("../utils/permission")
const Group = require("../utils/group")
const db = require("../utils/db")
const {ErrorMessage, ErrorCode} = require("../utils/error_message");

/**
 *
 * @param {PermissionNodes}permission
 * @param {PermissionActions}action
 */
const set_interviewee_permission = async (permission, action)=>{
    await set_permission(permission, action, `interviewee`, "", OverwriteType.Member)
}

/**
 *
 * @param {PermissionNodes}permission
 * @param {PermissionActions}action
 */
const set_bot_permission = async (permission, action)=>{
    const record = await db.get_first(`SELECT target_id FROM permissions WHERE "group" LIKE 'bot'`)

    await set_permission(permission, action, `bot`, record.target_id, OverwriteType.Role)
}

/**
 *
 * @param {PermissionNodes}permission
 * @param {PermissionActions}action
 * @param {string}target_id
 * @param {OverwriteType.Role | OverwriteType.Member}type
 */
const set_common_permission = async (permission, action, target_id, type)=>{
    await set_permission(permission, action, `common`, target_id, type)
}

/**
 *
 * @param {PermissionNodes}permission
 * @param {PermissionActions}action
 * @param {string}group
 * @param {string}target_id
 * @param {OverwriteType.Role | OverwriteType.Member}type
 */
const set_group_permission = async (permission, action, group, target_id, type)=>{
    const group_sign = await Group.get_sign(group)
    if(!group_sign) throw new ErrorMessage(ErrorCode.NotExistGroupSign, `not found Sign with the given "${group}"`)

    await set_permission(permission, action, group,target_id, type)
}


/**
 *
 * @param {PermissionActions}action
 */
const set_all_interviewee_permission = async (action)=>{
    for(let node in PermissionNodes){
        await set_permission(node, action, `interviewee`, "", OverwriteType.Member)
    }
}

/**
 *
 * @param {PermissionActions}action
 */
const set_all_bot_permission = async (action)=>{
    const record = await db.get_first(`SELECT target_id FROM permissions WHERE "group" LIKE 'bot'`)
    for(let node in PermissionNodes) {
        await set_permission(node, action, `bot`, record.target_id, OverwriteType.Role)
    }
}

/**
 *
 * @param {PermissionActions}action
 * @param {string}target_id
 * @param {OverwriteType.Role | OverwriteType.Member}type
 */
const set_all_common_permission = async (action, target_id, type)=>{
    for(let node in PermissionNodes) {
        await set_permission(node, action, `common`, target_id, type)
    }
}

/**
 *
 * @param {PermissionActions}action
 * @param {string}group
 * @param {string}target_id
 * @param {OverwriteType.Role | OverwriteType.Member}type
 */
const set_all_group_permission = async (action, group, target_id, type)=>{
    const group_sign = await Group.get_sign(group)
    if(!group_sign) throw new ErrorMessage(ErrorCode.NotExistGroupSign, `not found Sign with the given "${group}"`)

    for(let node in PermissionNodes) {
        await set_permission(node, action, group, target_id, type)
    }
}

exports.set_interviewee_permission = set_interviewee_permission
exports.set_bot_permission = set_bot_permission
exports.set_common_permission = set_common_permission
exports.set_group_permission = set_group_permission
exports.set_all_interviewee_permission = set_all_interviewee_permission
exports.set_all_bot_permission = set_all_bot_permission
exports.set_all_common_permission = set_all_common_permission
exports.set_all_group_permission = set_all_group_permission