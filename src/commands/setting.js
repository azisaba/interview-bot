const { SlashCommandBuilder, SlashCommandSubcommandBuilder, EmbedBuilder} = require('discord.js');
const { ChannelType } = require("discord-api-types/payloads/v10")
const Group = require("../utils/group")
const Setting = require("../setting")


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
            const embed = new EmbedBuilder()
                .setTitle("エラーが発生しました")
                .setDescription("signが2字ではありません。")
                .setColor('#ea5a59')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true});
        }

        try{
            Group.set(sign, name)

            const embed = new EmbedBuilder()
                .setTitle("グループが追加されました。")
                .setDescription(`グループ名 > ${name}\nサイン > ${sign}`)
                .setColor('#a7f1a9')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true});
        }catch (e) {
            const embed = new EmbedBuilder()
                .setTitle("エラーが発生しました")
                .setDescription(e.toString())
                .setColor('#ea5a59')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true});
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
            const embed = new EmbedBuilder()
                .setTitle("エラーが発生しました")
                .setDescription("signが2字ではありません。")
                .setColor('#ea5a59')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true});
        }

        const sign = input_sign ? input_sign : await Group.get_sign(name)

        try{
            if(!sign) throw new Error(`"sign" is not found.`)
            Group.remove(sign)
        }catch (e) {
            const embed = new EmbedBuilder()
                .setTitle("エラーが発生しました")
                .setDescription(e.toString())
                .setColor('#ea5a59')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true});
        }

        const embed = new EmbedBuilder()
            .setTitle("グループが削除されました。")
            .setDescription(`グループ名 > ${name}\nサイン > ${sign}`)
            .setColor('#f3ad9d')
            .setTimestamp()

        await interaction.reply({embeds: [embed], ephemeral: true});
    },
}

const set_channel_subcommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('set-channel')
        .setDescription('チャンネルの設定を行います。')
        .addStringOption(option=>
            option.setName("key")
                .setDescription("設定する項目")
                .setRequired(true)
                .addChoices(
                    { name: 'システムログチャンネル', value: Setting.setting_value.SYSTEM_LOG_CHANNEL_ID },
                    { name: 'チャットログチャンネル', value: Setting.setting_value.CHAT_LOG_CHANNEL_ID },
                    { name: '面接チャンネルカテゴリー', value: Setting.setting_value.INTERVIEW_CATEGORY_ID },
                    { name: '面接チャンネル アーカイブカテゴリー', value: Setting.setting_value.ARCHIVE_INTERVIEW_CHANNEL_CATEGORY_ID },
                ))
        .addChannelOption(option=>
            option.setName("channel")
                .setDescription("設定するチャンネル")
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildCategory)
                .setRequired(true)
        ),

    async execute(interaction) {
        const key = interaction.options.getString('key')
        try {
            const channel = interaction.options.getChannel("channel", true, [ChannelType.GuildText, ChannelType.GuildCategory])

            if( (Setting.setting_values_channels_type[key]===ChannelType.GuildText && channel.type === ChannelType.GuildText) ||
                (Setting.setting_values_channels_type[key]===ChannelType.GuildCategory && channel.type === ChannelType.GuildCategory)
            ){
                Setting.set_value(key, channel.id)

                const embed = new EmbedBuilder()
                    .setTitle("チャンネルを設定しました。")
                    .setDescription(`Key > ${key}\n設定値 > <#${channel.id}>`)
                    .setColor('#a7f1a9')
                    .setTimestamp()

                await interaction.reply({embeds: [embed], ephemeral: true});
            } else {
                const embed = new EmbedBuilder()
                    .setTitle("エラーが発生しました")
                    .setDescription("指定されたkeyが期待するチャンネルタイプと指定されたチャンネルが一致しません。")
                    .setColor('#ea5a59')
                    .setTimestamp()

                await interaction.reply({embeds: [embed], ephemeral: true});
            }
        }catch (e) {
            const embed = new EmbedBuilder()
                .setTitle("エラーが発生しました")
                .setColor('#ea5a59')
                .setTimestamp()

            if(e.code==="CommandInteractionOptionInvalidChannelType") embed.setDescription('チャンネルのタイプが不正です。');

            await interaction.reply({embeds: [embed], ephemeral: true});
        }
    },
};


module.exports = {
    data: new SlashCommandBuilder()
        .setName('setting')
        .setDescription('設定の変更を行います。')
        .addSubcommand(add_group_subcommand.data)
        .addSubcommand(remove_group_subcommand.data)
        .addSubcommand(set_channel_subcommand.data),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'add-group') await add_group_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'remove-group') await remove_group_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'set-channel') await set_channel_subcommand.execute(interaction)
    },
};
