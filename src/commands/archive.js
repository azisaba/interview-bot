const { SlashCommandBuilder } = require('discord.js');
const { move_archive_category } = require("../commons/move_archive_category")
const { ChannelType } = require("discord-api-types/payloads/v10")

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
            await interaction.reply('チャンネルをアーカイブしました。');
        }catch (e) {
            console.log(e)
            await interaction.reply(e.get_message());
        }
    },
};
