const { SlashCommandBuilder, SlashCommandSubcommandBuilder} = require('discord.js');
const Group = require("../utils/group")



const add_group_subcommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('add-group')
        .setDescription('グループの追加を行います。')
        .addStringOption(option=>
            option.setName("sign")
                .setDescription("グループを表す2字の英字(小文字)")
                .setRequired(true))
        .addStringOption(option=>
            option.setName("name")
                .setDescription("グループの名前(大小英数字)")
                .setRequired(true)),
    async execute(interaction) {

        const sign = interaction.options.getString('sign');
        const name = interaction.options.getString('name');

        if(sign.length!==2) {
            await interaction.reply('signが2字ではないです!');
        }

        try{
            Group.set(sign, name)
            await interaction.reply('追加されました');
        }catch (e) {
            await interaction.reply(e.toString());
        }

    },
}

const remove_group_subcommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('remove-group')
        .setDescription('グループの消去を行います。')
        .addStringOption(option=>
            option.setName("sign")
                .setDescription("グループを表す2字の英字(小文字)"))
        .addStringOption(option=>
            option.setName("name")
                .setDescription("グループの名前(大小英数字)")),
    async execute(interaction) {

        const input_sign = interaction.options.getString('sign');
        const name = interaction.options.getString('name');

        if(input_sign && input_sign.length!==2) {
            await interaction.reply('signが2字ではないです!');
        }

        const sign = input_sign ? input_sign : await Group.get_sign(name)

        try{
            if(!sign) throw new Error(`"sign" is not found.`)
            Group.remove(sign)
        }catch (e) {
            await interaction.reply(e.toString());
        }

        await interaction.reply('削除されました');
    },
}

/**
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setting')
        .setDescription('設定の変更を行います。')
        .addSubcommand(group_subcommand)
        .addStringOption(option=>
            option.setName("key")
                .setDescription("設定する項目")
                .setRequired(true)
                .addChoices(
                    { name: 'システムログチャンネル', value: 'SYSTEM_LOG_CHANNEL_ID' },
                    { name: 'チャットログチャンネル', value: 'CHAT_LOG_CHANNEL_ID' },
                ))
        .addStringOption(option=>
            option.setName("value")
                .setDescription("設定する値")),

    async execute(interaction) {
        console.log(interaction.options.getString('key'), interaction.options.getString('value'))
        await interaction.reply('Pong!');
    },
};
    **/

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setting')
        .setDescription('設定の変更を行います。')
        .addSubcommand(add_group_subcommand.data)
        .addSubcommand(remove_group_subcommand.data),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'add-group') await add_group_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'remove-group') await remove_group_subcommand.execute(interaction)
    },
};


