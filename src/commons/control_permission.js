const { OverwriteType } = require("discord.js")
const { PermissionActions, PermissionNodes, set_permission, set_exist_permissions, clone_permissions} = require("../utils/permission")
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

//--------

/**
 *
 * @param {PermissionActions}action
 */
const set_exist_interviewee_permissions = async (action)=>{
    return await set_exist_permissions(action, `interviewee`, "", OverwriteType.Member)
}

/**
 *
 * @param {PermissionActions}action
 */
const set_exist_bot_permissions = async (action)=>{
    const record = await db.get_first(`SELECT target_id FROM permissions WHERE "group" LIKE 'bot'`)

    return await set_exist_permissions(action, "bot", record.target_id, OverwriteType.Role)
}

/**
 *
 * @param {PermissionActions}action
 * @param {string}target_id
 * @param {OverwriteType.Role | OverwriteType.Member}type
 */
const set_exist_common_permission = async (action, target_id, type)=>{
    return await set_exist_permissions(action, "common", target_id, type)
}

/**
 *
 * @param {PermissionActions}action
 * @param {string}group
 * @param {string}target_id
 * @param {OverwriteType.Role | OverwriteType.Member}type
 */
const set_exist_group_permission = async (action, group, target_id, type)=>{
    const group_sign = await Group.get_sign(group)
    if(!group_sign) throw new ErrorMessage(ErrorCode.NotExistGroupSign, `not found Sign with the given "${group}"`)

    return await set_exist_permissions(action, group_sign, target_id, type)
}

/**
 *
 * @param {string}input_origin_group
 * @param {string}input_target_group
 */
const clone_permissions_from_exist_permissions = async (input_origin_group, input_target_group)=>{
    const origin_group = ["interviewee", "bot", "common"].includes(input_origin_group) ? input_origin_group : await Group.get_sign(input_origin_group)
    const target_group = ["interviewee", "bot", "common"].includes(input_target_group) ? input_target_group : await Group.get_sign(input_target_group)

    if(!origin_group) throw new ErrorMessage(ErrorCode.NotExistGroupSign, `The origin group sign with the specified “${input_origin_group}” is not found."`)
    if(!target_group) throw new ErrorMessage(ErrorCode.NotExistGroupSign, `The target group sign with the specified “${input_target_group}” is not found."`)

    return await clone_permissions(origin_group, target_group, "", "")
}


exports.set_interviewee_permission = set_interviewee_permission
exports.set_bot_permission = set_bot_permission
exports.set_common_permission = set_common_permission
exports.set_group_permission = set_group_permission
exports.set_all_interviewee_permission = set_all_interviewee_permission
exports.set_all_bot_permission = set_all_bot_permission
exports.set_all_common_permission = set_all_common_permission
exports.set_all_group_permission = set_all_group_permission
exports.set_exist_interviewee_permissions = set_exist_interviewee_permissions
exports.set_exist_bot_permissions = set_exist_bot_permissions
exports.set_exist_common_permission = set_exist_common_permission
exports.set_exist_group_permission = set_exist_group_permission
exports.clone_permissions_from_exist_permissions = clone_permissions_from_exist_permissions
