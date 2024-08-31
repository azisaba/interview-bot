const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ChannelType } = require("discord-api-types/payloads/v10")
const { add_controlling_channel } = require("../commons/controlling-channel")
const ControllingChannelState = require("../utils/controlling_channel_state")
const { send_embed_to_system_log_channel } = require("../commons/send_system_log")
const { ErrorMessage } = require("../utils/error_message");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-controlling')
        .setDescription('管理対象のチャンネルを追加します。')
        .addChannelOption(option=>
            option.setName("channel")
                .setDescription("チャンネルを指定します。(指定しない場合は送信したチャンネル)")
                .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption(option=>
            option.setName("state")
                .setDescription("状態を指定します。(指定していない場合はアクティブ)")
                .addChoices(
                    { name: 'アクティブ', value: ControllingChannelState.ACTIVE},
                    { name: '非アクティブ', value: ControllingChannelState.INACTIVE },
                )
        ),
    async execute(interaction) {
        const send_channel = await interaction.guild.channels.fetch(interaction.channelId);
        const option_set_channel = interaction.options.getChannel("channel", false, [ChannelType.GuildText])

        const target_channel = option_set_channel ? option_set_channel : send_channel;

        const state = interaction.options.getString("state") ? interaction.options.getString("state") : ControllingChannelState.ACTIVE

        try{
            await add_controlling_channel(target_channel, state)

            const embed = new EmbedBuilder()
                .setTitle("チャンネルを管理対象に追加しました。")
                .setFields(
                    {name: "チャンネル", value: `<#${target_channel.id}>\n(${target_channel.name} = ${target_channel.id})`},
                    {name: "状態", value: `${state===ControllingChannelState.ACTIVE ? "アクティブ" : "非アクティブ"}`},
                    {name: " ", value: `※権限等の設定はされませんので、手動で行ってください。`},
                )
                .setColor('#9aec9f')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true});
            await send_embed_to_system_log_channel(embed)
        }catch (e) {
            console.error(e)

            const embed = new EmbedBuilder()
                .setTitle("エラーが発生しました")
                .setDescription(e instanceof ErrorMessage ? e.get_message(): "")
                .setColor('#ea5a59')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true});
        }
    },
};
