const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const create_interview_channel = require("../commons/create_interview_channel")
const Group = require("../utils/group")
const { ErrorMessage } = require("../utils/error_message");
const ControllingChannelState = require("../utils/controlling_channel_state");
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
        const interviewee = interaction.options.getUser("interviewee")
        const server = interaction.options.getString('server')
        const channel = await create_interview_channel.create_interview_channel(
            interaction.client,
            interviewee,
            server
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
                {name: "チャンネル", value: `<#${channel.id}>\n(${channel.name} = ${channel.id})`},
                {name: "面接するユーザ", value: `<@${interviewee.id}>\n(${interviewee.tag} = ${interviewee.id})`},
                {name: "グループ", value: `${server}`},
            )
            .setColor('#9aec9f')
            .setTimestamp()

        await interaction.reply({embeds: [embed], ephemeral: true})
        await send_embed_to_system_log_channel(embed)
    },
};
