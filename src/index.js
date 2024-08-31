'use strict'

const {Client,GatewayIntentBits, EmbedBuilder} = require("discord.js")
const command_register = require("./command_register")
const listener_register = require("./listener_register")
const db = require("./utils/db")
const setting = require("./setting")
const send_system_log = require("./commons/send_system_log");
require("dotenv-safe").config();


const debug_mode = process.env.NODE_ENV==="development";
if (debug_mode) {
    console.info("debug mode")
    process.env.DEBUG = "interview-bot:*"
}

const client = new Client({intents:[GatewayIntentBits.Guilds]})

process.on("exit", ()=>{
    client.destroy();
    console.info("Exiting...");
});
process.on("SIGINT", ()=>{
    process.exit(0);
});
send_system_log.init(client)

db.init().then(r=>{
    setting.init().then(rr=> {
        if(debug_mode) require("./dev")()
        else require("./utils/initial_value")()
    })
})


client.once("ready", async (c) =>{

    console.info(`Login! ${c.user.tag}`)

    listener_register(client)
    await command_register(client);

    const embed = new EmbedBuilder()
        .setTitle("面接BOTが起動しました")
        .setColor('#06f919')
        .setTimestamp()

    await send_system_log.send_embed_to_system_log_channel(embed)
})



client.login(process.env.DISCORD_BOT_TOKEN)
    .catch(e => {
        console.error("Error! Cannot login Discord.")
        console.error(e)
    })

