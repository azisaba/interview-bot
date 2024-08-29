const db = require("./utils/db")

const setting_value_keys = {
    SYSTEM_LOG_CHANNEL_ID: "channel",
    CHAT_LOG_CHANNEL_ID: "channel",
    INTERVIEW_CATEGORY_ID: "category",
    ARCHIVE_INTERVIEW_CHANNEL_CATEGORY_ID: "category",
}

/**
 * @enum {string}
 */
const setting_value = {
    SYSTEM_LOG_CHANNEL_ID: "SYSTEM_LOG_CHANNEL_ID",
    CHAT_LOG_CHANNEL_ID: "CHAT_LOG_CHANNEL_ID",
    INTERVIEW_CATEGORY_ID: "INTERVIEW_CATEGORY_ID",
    ARCHIVE_INTERVIEW_CHANNEL_CATEGORY_ID: "ARCHIVE_INTERVIEW_CHANNEL_CATEGORY_ID",
    INTERVIEW_CHANNEL_ANNOUNCEMENT_MESSAGE: "INTERVIEW_CHANNEL_ANNOUNCEMENT_MESSAGE",
}

const init = async () => {
    for(let key in setting_value_keys){
        const res = await db.get_first("SELECT * FROM setting_values WHERE key LIKE ?", [key])
        if(res) continue;
        db.execute("INSERT INTO setting_values(key, value) VALUES (?,?)", [key, null])
    }
}

/**
 *
 * @param {setting_value} key
 * @param {string} value
 */
const set_value = (key, value)=>{
    db.execute("UPDATE setting_values SET value=? WHERE key LIKE ?", [value, key])
}

/**
 *
 * @param {setting_value}key
 * @return {Promise<string|undefined>}
 */
const get_value = async (key)=>{
    const res = await db.get_first("SELECT value FROM setting_values WHERE key LIKE ?", [key])
    return res?.value;
}


exports.setting_value = setting_value
exports.init = init
exports.set_value = set_value
exports.get_value = get_value
