const { SlashCommandBuilder, SlashCommandSubcommandBuilder, EmbedBuilder} = require('discord.js');
const { ChannelType } = require("discord-api-types/payloads/v10")
const Group = require("../utils/group")
const Setting = require("../setting")
const { send_embed_to_system_log_channel } = require("../commons/send_system_log");


const add_group_subcommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('add-group')
        .setDescription('グループの追加を行います。')
        .addStringOption(option=>
            option.setName("sign")
                .setDescription("グループを表す2字の英字(小文字)")
                .setRequired(true)
                .setMinLength(2)
                .setMaxLength(2))
        .addStringOption(option=>
            option.setName("name")
                .setDescription("グループの名前(大小英数字)")
                .setRequired(true)
                .setMinLength(2)),
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
            await Group.set(sign, name)

            const embed = new EmbedBuilder()
                .setTitle("グループが追加されました。")
                .setFields(
                    {name: "グループ名", value: `${name}`},
                    {name: "サイン", value: `${sign}`},
                )
                .setColor('#a7f1a9')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true})
            await send_embed_to_system_log_channel(embed)
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
                .setDescription("グループを表す2字の英字(小文字)")
                .setMinLength(2)
                .setMaxLength(2))
        .addStringOption(option=>
            option.setName("name")
                .setDescription("グループの名前(大小英数字)")
                .setMinLength(2)),
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
            await Group.remove(sign)
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
            .setFields(
                {name: "グループ名", value: `${name}`},
                {name: "サイン", value: `${sign}`},
            )
            .setColor('#f3ad9d')
            .setTimestamp()

        await interaction.reply({embeds: [embed], ephemeral: true})
        await send_embed_to_system_log_channel(embed)
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
                    .setFields(
                        {name: "Key", value: `${key}`},
                        {name: "設定値", value: `<#${channel.id}>`},
                    )
                    .setColor('#a7f1a9')
                    .setTimestamp()

                await interaction.reply({embeds: [embed], ephemeral: true})
                await send_embed_to_system_log_channel(embed)
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


const set_announce_message_subcommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('set-announce-message')
        .setDescription('面接チャンネル作成時に送信されるメッセージの設定を行います。')
        .addStringOption(option=>
            option.setName("message")
                .setDescription("メッセージ内容")
                .setRequired(true)
        ),
    async execute(interaction) {
        const message = interaction.options.getString('message')
        try {
            Setting.set_value(Setting.setting_value.INTERVIEW_CHANNEL_ANNOUNCEMENT_MESSAGE, message)
            const embed = new EmbedBuilder()
                .setTitle("メッセージを設定しました。")
                .setFields(
                    {name: "メッセージ内容", value: message},
                )
                .setColor('#a7f1a9')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true})
            await send_embed_to_system_log_channel(embed)
        }catch (e) {
            const embed = new EmbedBuilder()
                .setTitle("エラーが発生しました")
                .setDescription(e.toString())
                .setColor('#ea5a59')
                .setTimestamp()

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
        .addSubcommand(set_channel_subcommand.data)
        .addSubcommand(set_announce_message_subcommand.data),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'add-group') await add_group_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'remove-group') await remove_group_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'set-channel') await set_channel_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'set-announce-message') await set_announce_message_subcommand.execute(interaction)
    },
};
