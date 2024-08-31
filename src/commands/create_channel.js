const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const create_interview_channel = require("../commons/create_interview_channel")
const Group = require("../utils/group")
const {ErrorMessage} = require("../utils/error_message");
const { ErrorMessage } = require("../utils/error_message");
const { ErrorMessage } = require("../utils/error_message");
const  {send_embed_to_system_log_channel } = require("../commons/send_system_log");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-interview-channel')
        .setDescription('面接チャンネルを作成します')
        .addUserOption(option=>
            option.setName("interviewee")
                  .setDescription("面接するユーザを指定します。")
                  .setRequired(true)
        )
        .addStringOption( option=>
                option.setName("server")
                    .setDescription("面接を行うサーバを指定します。")
                    .setRequired(true)
        ),
    /**
     * @param {ChatInputCommandInteraction}interaction
     * @return {Promise<void>}
     */
    async execute(interaction) {
        const channel = await create_interview_channel.create_interview_channel(
            interaction.client,
            interaction.options.getUser("interviewee"),
            interaction.options.getString('server')
        )

        if(channel instanceof ErrorMessage){
            const embed = new EmbedBuilder()
                .setTitle("エラーが発生しました")
                .setDescription(channel.get_message())
                .setColor('#ea5a59')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true});
            return
        }

        const embed = new EmbedBuilder()
            .setTitle("チャンネルの作成が完了しました")
            .setFields(
                {name: "チャンネル", value: `<#${channel.id}>`},
                {name: "面接するユーザ", value: `<@${interaction.options.getUser("interviewee").id}>`},
                {name: "グループ", value: `${interaction.options.getString('server')}`},
            )
            .setColor('#9aec9f')
            .setTimestamp()

        await interaction.reply({embeds: [embed], ephemeral: true})
        await send_embed_to_system_log_channel(embed)
    },
};
