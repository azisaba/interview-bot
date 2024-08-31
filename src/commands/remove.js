const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { remove_archived_channel } = require("../commons/remove_archived_channel")
const { ChannelType } = require("discord-api-types/payloads/v10")
const { ErrorMessage } = require("../utils/error_message");
const setting = require("../setting");
const { send_embed_to_system_log_channel } = require("../commons/send_system_log");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('アーカイブされたチャンネルを削除します。')
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
            const embed = new EmbedBuilder()
                .setTitle("5秒後にチャンネルを削除します。")
                .setFields(
                    {name: "チャンネル", value: `${target_channel.name}\n(${target_channel.id})`},
                )
                .setColor('#f3ad9d')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true});

            const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));//timeはミリ秒
            await sleep(5000)

            await remove_archived_channel(target_channel)

            embed.setTitle("チャンネルを削除しました。")
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
