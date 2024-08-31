const db = require("../utils/db")
const {ErrorMessage, ErrorCode} = require("./error_message");

const no_use_word = ["common", "interviewee"]
/**
 *
 * @param {string} sign
 * @param {string} name
 */
const set = (sign, name)=> {
    if(no_use_word.includes(name.toLowerCase()) || no_use_word.includes(sign.toLowerCase())) throw new Error();
    db.execute(`INSERT INTO groups(sign, name) VALUES (?,?)`, [sign, name])
}

/**
 *
 * @param {string} sign
 * @return {Promise<string|undefined>}
 */
const get_name = async (sign) => {
    const res = await db.get_first(`SELECT name FROM 'groups' WHERE sign LIKE ?`, [sign])
    return res?.name
}

/**
 *
 * @param {string} name
 * @param {string} [default_value=undefined]
 * @return {Promise<string|undefined>}
 */
const get_sign = async (name,default_value=undefined) => {
    const res = await db.get_first(`SELECT sign FROM 'groups' WHERE name LIKE ?`, [name])
    return res?.sign ? res["sign"] : default_value
}

/**
 *
 * @return {Promise<{sign: string, name: string}[]|undefined>}
 */
const get_all = async () => {
    return await db.get_all(`SELECT * FROM 'groups'`)
}

/**
 *
 * @param {string} sign
 * @throws {ErrorMessage}
 */
const remove = async (sign) => {
    if(no_use_word.includes(name.toLowerCase()) || no_use_word.includes(sign.toLowerCase())) throw new ErrorMessage("UseNotAllowedWord", "This word is not allowed.");
    if(!(await get_name(sign))) throw new ErrorMessage(ErrorCode.NotExistGroupSign, `The specified Sign “${sign}” was not found.`)
    return db.execute(`DELETE FROM 'groups' WHERE sign LIKE ?`, [sign])
}

exports.set = set
exports.get_name = get_name
exports.get_sign = get_sign
exports.get_all = get_all
exports.remove = remove
