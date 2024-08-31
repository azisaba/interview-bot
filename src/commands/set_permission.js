const { SlashCommandBuilder, EmbedBuilder, SlashCommandSubcommandBuilder, OverwriteType } = require('discord.js');
const { move_archive_category } = require("../commons/move_archive_category")
const { ChannelType, PermissionFlagsBits } = require("discord-api-types/payloads/v10")
const { ErrorMessage } = require("../utils/error_message");
const ControllingChannelState = require("../utils/controlling_channel_state");
const {set_interviewee_permission, set_bot_permission, set_common_permission, set_group_permission,
    set_all_interviewee_permission, set_all_bot_permission, set_all_common_permission, set_all_group_permission,
    set_exist_interviewee_permissions, set_exist_bot_permissions, set_exist_common_permission, set_exist_group_permission,
    clone_permissions_from_exist_permissions
} = require("../commons/control_permission")
const {PermissionActions, PermissionNodes, get_permission_node_command_choices_format } = require("../utils/permission")
const Group = require("../utils/group");
const Setting = require("../setting");
const { send_embed_to_system_log_channel } = require("../commons/send_system_log");


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
            if(node === PermissionNodes.All) await set_all_interviewee_permission(action)
            else if(node === PermissionNodes.ExistAll) await set_exist_interviewee_permissions(action)
            else await set_interviewee_permission(node, action)

            const embed = new EmbedBuilder()
                .setTitle("パーミッションが設定されました。")
                .setFields(
                    {name: "対象", value: `面接するユーザ(interviewee)`},
                    {name: "パーミッションノード", value: `${node}`},
                    {name: "アクション", value: `${action}`},
                    {name: " ", value: `※既存のチャンネルの権限設定は変更されませんので、手動で行ってください。`},
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
            if(node === PermissionNodes.All) await set_all_bot_permission(action)
            else if(node === PermissionNodes.ExistAll) await set_exist_bot_permissions(action)
            else await set_bot_permission(node, action)

            const embed = new EmbedBuilder()
                .setTitle("パーミッションが設定されました。")
                .setFields(
                    {name: "対象", value: `bot`},
                    {name: "パーミッションノード", value: `${node}`},
                    {name: "アクション", value: `${action}`},
                    {name: " ", value: `※既存のチャンネルの権限設定は変更されませんので、手動で行ってください。`},
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
            if(node === PermissionNodes.All) await set_all_common_permission(action, user.id, OverwriteType.Member)
            else if(node === PermissionNodes.ExistAll) await set_exist_common_permission(action, user.id, OverwriteType.Member)
            else await set_common_permission(node, action, user.id, OverwriteType.Member)

            const embed = new EmbedBuilder()
                .setTitle("パーミッションが設定されました。")
                .setFields(
                    {name: "対象", value: `<@${user.id}>`},
                    {name: "パーミッションノード", value: `${node}`},
                    {name: "アクション", value: `${action}`},
                    {name: " ", value: `※既存のチャンネルの権限設定は変更されませんので、手動で行ってください。`},
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
            if(node === PermissionNodes.All) await set_all_common_permission(action, role.id, OverwriteType.Role)
            else if(node === PermissionNodes.ExistAll) await set_exist_common_permission(action, role.id, OverwriteType.Role)
            else await set_common_permission(node, action, role.id, OverwriteType.Role)

            const embed = new EmbedBuilder()
                .setTitle("パーミッションが設定されました。")
                .setFields(
                    {name: "対象", value: `<@&${role.id}>`},
                    {name: "パーミッションノード", value: `${node}`},
                    {name: "アクション", value: `${action}`},
                    {name: " ", value: `※既存のチャンネルの権限設定は変更されませんので、手動で行ってください。`},
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
            if(node === PermissionNodes.All) await set_all_group_permission(action, group, role.id, OverwriteType.Role)
            else if(node === PermissionNodes.ExistAll) await set_exist_group_permission(action, group, role.id, OverwriteType.Role)
            else await set_group_permission(node, action, group,role.id, OverwriteType.Role)

            const embed = new EmbedBuilder()
                .setTitle("パーミッションが設定されました。")
                .setFields(
                    {name: "対象", value: `<@&${role.id}>`},
                    {name: "パーミッションノード", value: `${node}`},
                    {name: "アクション", value: `${action}`},
                    {name: " ", value: `※既存のチャンネルの権限設定は変更されませんので、手動で行ってください。`},
                )
                .setColor('#a7f1a9')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true})
            await send_embed_to_system_log_channel(embed)
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

const clone_permissions_subcommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('clone')
        .setDescription('パーミッションの複製を行います。')
        .addStringOption(option=>
            option.setName("origin-group")
                .setDescription("パーミッションの複製元のグループ名")
                .setMinLength(2)
                .setRequired(true)
        )
        .addStringOption(option=>
            option.setName("target-group")
                .setDescription("パーミッションの複製先のグループ名")
                .setMinLength(2)
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        const origin_group = interaction.options.getString('origin-group')
        const target_group = interaction.options.getString('target-group')

        try{
            const permission_nodes = await clone_permissions_from_exist_permissions(origin_group, target_group)

            const embed = new EmbedBuilder()
                .setTitle("パーミッションが複製されました。")
                .setDescription(`複製元 > ${origin_group}\n複製先> ${target_group}\n`)
                .setFields(
                    {name: "複製元", value: `${origin_group}`},
                    {name: "複製先", value: `${target_group}`},
                    {name: "複製されたパーミッションノード", value: `${permission_nodes.map(v=>{return `${v.permission}: ${v.action}`}).join("\n")}`},
                )
                .setColor('#a7f1a9')
                .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true})
            await send_embed_to_system_log_channel(embed)
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
        .addSubcommand(clone_permissions_subcommand.data)
    ,
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'interviewee') await set_interviewee_permission_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'bot')         await set_bot_permission_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'common-user') await set_common_user_permission_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'common-role') await set_common_role_permission_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'group')       await set_group_permission_subcommand.execute(interaction)
        if (interaction.options.getSubcommand() === 'clone')       await clone_permissions_subcommand.execute(interaction)
    },
};
