const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { move_archive_category } = require("../commons/move_archive_category")
const { ChannelType } = require("discord-api-types/payloads/v10")
const {ErrorMessage} = require("../utils/error_message");
const { ErrorMessage } = require("../utils/error_message");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('archive')
        .setDescription('チャンネルをアーカイブします。')
        .addChannelOption(option=>
            option.setName("channel")
                .setDescription("チャンネルを指定します。(指定しない場合は送信したチャンネル)")
                .addChannelTypes(ChannelType.GuildText)
        ),
    async execute(interaction) {
        const send_channel = await interaction.guild.channels.fetch(interaction.channelId);
        const option_set_channel = interaction.options.getChannel("channel", false, [ChannelType.GuildText])

        const target_channel = option_set_channel ? option_set_channel : send_channel;

        try{
            await move_archive_category(target_channel)
            const embed = new EmbedBuilder()
                .setTitle("チャンネルをアーカイブしました。")
                .setFields(
                    {name: "チャンネル", value: `<#${target_channel.id}>`},
                )
                .setColor('#9aec9f')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true});
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
