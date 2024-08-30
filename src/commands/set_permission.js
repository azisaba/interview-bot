const { SlashCommandBuilder, EmbedBuilder, SlashCommandSubcommandBuilder, OverwriteType} = require('discord.js');
const { move_archive_category } = require("../commons/move_archive_category")
const { ChannelType, PermissionFlagsBits } = require("discord-api-types/payloads/v10")
const {ErrorMessage} = require("../utils/error_message");
const ControllingChannelState = require("../utils/controlling_channel_state");
const {set_interviewee_permission, set_bot_permission, set_common_permission, set_group_permission,
    set_all_interviewee_permission, set_all_bot_permission, set_all_common_permission, set_all_group_permission
} = require("../commons/control_permission")
const {PermissionActions, get_permission_node_command_choices_format } = require("../utils/permission")
const Group = require("../utils/group");
const Setting = require("../setting");


const set_interviewee_permission_subcommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('interviewee')
        .setDescription('面接するユーザの権限設定を行います。')
        .addStringOption(option=>
            option.setName("node")
                .setDescription("パーミッションの種類")
                .setRequired(true)
                .setChoices(...get_permission_node_command_choices_format())
        )
        .addStringOption(option=>
            option.setName("action")
                .setDescription("パーミッションの設定")
                .setRequired(true)
                .setChoices(
                    { name: '許可', value: PermissionActions.ALLOW },
                    { name: '拒否', value: PermissionActions.DENY },
                    { name: '設定なし', value: PermissionActions.NONE },
                )
        ),
    async execute(interaction) {
        const node = interaction.options.getString('node')
        const action = interaction.options.getString('action')

        try{
            if(node === "All") await set_all_interviewee_permission(action)
            else await set_interviewee_permission(node, action)

            const embed = new EmbedBuilder()
                .setTitle("パーミッションが設定されました。")
                .setDescription(`対象 > 面接するユーザ\nパーミッションノード > ${node}\nアクション > ${action}`)
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

const set_bot_permission_subcommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('bot')
        .setDescription('面接botの権限設定を行います。')
        .addStringOption(option=>
            option.setName("node")
                .setDescription("パーミッションの種類")
                .setRequired(true)
                .setChoices(...get_permission_node_command_choices_format())
        )
        .addStringOption(option=>
            option.setName("action")
                .setDescription("パーミッションの設定")
                .setRequired(true)
                .setChoices(
                    { name: '許可', value: PermissionActions.ALLOW },
                    { name: '拒否', value: PermissionActions.DENY },
                    { name: '設定なし', value: PermissionActions.NONE },
                )
        ),
    async execute(interaction) {
        const node = interaction.options.getString('node')
        const action = interaction.options.getString('action')

        try{
            if(node === "All") await set_all_bot_permission(action)
            else await set_bot_permission(node, action)

            const embed = new EmbedBuilder()
                .setTitle("パーミッションが設定されました。")
                .setDescription(`　　　　対象　　　　　 > bot\nパーミッションノード > ${node}\n　　アクション　　　 > ${action}`)
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

const set_common_user_permission_subcommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('common-user')
        .setDescription('全チャンネル共通のユーザー権限設定を行います。')
        .addStringOption(option=>
            option.setName("node")
                .setDescription("パーミッションの種類")
                .setRequired(true)
                .setChoices(...get_permission_node_command_choices_format())
        )
        .addStringOption(option=>
            option.setName("action")
                .setDescription("パーミッションの設定")
                .setRequired(true)
                .setChoices(
                    { name: '許可', value: PermissionActions.ALLOW },
                    { name: '拒否', value: PermissionActions.DENY },
                    { name: '設定なし', value: PermissionActions.NONE },
                )
        )
        .addUserOption(option=>
            option.setName("user")
                .setDescription("パーミッションを設定するユーザ")
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        const node = interaction.options.getString('node')
        const action = interaction.options.getString('action')
        const user = interaction.options.getUser('user')

        try{
            if(node === "All") await set_all_common_permission(action, user.id, OverwriteType.Member)
            else await set_common_permission(node, action, user.id, OverwriteType.Member)

            const embed = new EmbedBuilder()
                .setTitle("パーミッションが設定されました。")
                .setDescription(`　　　　対象　　　　　 > <@${user.id}>\nパーミッションノード > ${node}\n　　アクション　　　 > ${action}`)
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

const set_common_role_permission_subcommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('common-role')
        .setDescription('全チャンネル共通のロール権限設定を行います。')
        .addStringOption(option=>
            option.setName("node")
                .setDescription("パーミッションの種類")
                .setRequired(true)
                .setChoices(...get_permission_node_command_choices_format())
        )
        .addStringOption(option=>
            option.setName("action")
                .setDescription("パーミッションの設定")
                .setRequired(true)
                .setChoices(
                    { name: '許可', value: PermissionActions.ALLOW },
                    { name: '拒否', value: PermissionActions.DENY },
                    { name: '設定なし', value: PermissionActions.NONE },
                )
        )
        .addRoleOption(option=>
            option.setName("role")
                .setDescription("パーミッションを設定するロール")
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        const node = interaction.options.getString('node')
        const action = interaction.options.getString('action')
        const role = interaction.options.getRole('role')

        try{
            if(node === "All") await set_all_common_permission(action, role.id, OverwriteType.Role)
            else await set_common_permission(node, action, role.id, OverwriteType.Role)

            const embed = new EmbedBuilder()
                .setTitle("パーミッションが設定されました。")
                .setDescription(`　　　　対象　　　　　 > <@&${role.id}>\nパーミッションノード > ${node}\n　　アクション　　　 > ${action}`)
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

const set_group_permission_subcommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('group')
        .setDescription('グループのロール権限設定を行います。')
        .addStringOption(option=>
            option.setName("node")
                .setDescription("パーミッションの種類")
                .setRequired(true)
                .setChoices(...get_permission_node_command_choices_format())
        )
        .addStringOption(option=>
            option.setName("action")
                .setDescription("パーミッションの設定")
                .setRequired(true)
                .setChoices(
                    { name: '許可', value: PermissionActions.ALLOW },
                    { name: '拒否', value: PermissionActions.DENY },
                    { name: '設定なし', value: PermissionActions.NONE },
                )
        )
        .addRoleOption(option=>
            option.setName("role")
                .setDescription("パーミッションを設定するロール")
                .setRequired(true)
        )
        .addStringOption(option=>
            option.setName("group")
                .setDescription("パーミッションを設定するグループ名")
                .setMinLength(2)
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        const node = interaction.options.getString('node')
        const action = interaction.options.getString('action')
        const role = interaction.options.getRole('role')
        const group = interaction.options.getString('group')

        try{
            if(node === "All") await set_all_group_permission(action, group, role.id, OverwriteType.Role)
            else await set_group_permission(node, action, group,role.id, OverwriteType.Role)

            const embed = new EmbedBuilder()
                .setTitle("パーミッションが設定されました。")
                .setDescription(`　　　　対象　　　　　 > <@&${role.id}>\nパーミッションノード > ${node}\n　　アクション　　　 > ${action}`)
                .setColor('#a7f1a9')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true});
        }catch (e) {
            console.error(e)
            const embed = new EmbedBuilder()
                .setTitle("エラーが発生しました")
                .setDescription(e.toString())
                .setColor('#ea5a59')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true});
        }

    },
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-permission')
        .setDescription('パーミッションを設定します。')
        .addSubcommand(set_interviewee_permission_subcommand.data)
        .addSubcommand(set_bot_permission_subcommand.data)
        .addSubcommand(set_common_user_permission_subcommand.data)
        .addSubcommand(set_common_role_permission_subcommand.data)
        .addSubcommand(set_group_permission_subcommand.data)
    ,
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'interviewee') await set_interviewee_permission_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'bot')         await set_bot_permission_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'common-user') await set_common_user_permission_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'common-role') await set_common_role_permission_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'group')       await set_group_permission_subcommand.execute(interaction)
    },
};
