const { SlashCommandBuilder } = require('discord.js');
const { add_controlling_channel } = require("../commons/controlling-channel")
const { ChannelType } = require("discord-api-types/payloads/v10")
const Setting = require("../setting");
const db  =require("../utils/db")
const ControllingChannelState = require("../utils/controlling_channel_state")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-rcontrolling')
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
                    { name: 'アクティブ「', value: ControllingChannelState.ACTIVE},
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
            await interaction.reply('チャンネルを管理対象に追加しました。');
        }catch (e) {
            console.log(e)
            await interaction.reply(e.get_message());
        }
    },
};
