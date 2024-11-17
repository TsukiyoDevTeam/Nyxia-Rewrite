import { SlashCommandBuilder } from 'discord.js';
import model from '../models/user.js';

export default {
    dev: true,
    owner: false,
    category: "Developer",

    data: new SlashCommandBuilder()
        .setName('badges')
        .setDescription('🔨 Add, remove or view badges of a user')

        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('🔨 Add a badge to a user')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('🎯')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('badge')
                        .setDescription('🏅')
                        .setRequired(true)
                )
        )

        .addSubcommand(subcommand => 
            subcommand
                .setName('remove')
                .setDescription('🔨 Remove a badge from a user')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('🎯')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('badge')
                        .setDescription('🏅')
                        .setRequired(true)
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('🔨 View the badges of a user')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('🎯')
                        .setRequired(true)
                )
        )
,

    async init(interaction, client, c) {
        console.log(c);
        
        const subcommandHandlers = {
            add: async () => {
                // Handle 'add' subcommand
            },
            remove: async () => {
                // Handle 'remove' subcommand
            },
            view: async () => {
                // Handle 'view' subcommand
            },
            default: async () => {
                await interaction.reply('Unknown subcommand.');
            }
        };
        
        const handler = subcommandHandlers[subcommand] || subcommandHandlers.default;
        await handler();


        return interaction.reply("done")
    },
};