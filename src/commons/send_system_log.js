const setting = require("../setting");
let client;

const init = (bot_client)=>{
    client = bot_client;
}

const send_embed_to_system_log_channel = async (embed)=>{
    const system_log_channel_id = await setting.get_value(setting.setting_value.SYSTEM_LOG_CHANNEL_ID)
    if(system_log_channel_id){
        const system_log_channel = await client.channels.fetch(system_log_channel_id);
        await system_log_channel.send({embeds: [embed]})
    }
}

exports.init = init
exports.send_embed_to_system_log_channel = send_embed_to_system_log_channel
