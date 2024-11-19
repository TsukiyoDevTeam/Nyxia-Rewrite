import { SlashCommandBuilder } from 'discord.js';

export default {
    dev: false,
    owner: false,
    category: "Utility",

    data: new SlashCommandBuilder()
        .setName('download')
        .setDescription('📂 Download data from the bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('📂 Download user data from the bot'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('📂 Download server data from the bot'))
,
    async init(interaction, client, c, t) {
        try {
            if (interaction.options.getSubcommand() === 'user') {
                const command = await import("../commands/download/user.js");
                return command.default(client, interaction, t);
            } else if (interaction.options.getSubcommand() === 'server') {
                const command = await import("../commands/download/server.js");
                return command.default(client, interaction, t);
            }
        } catch (error) {
            console.error('Error loading subcommand:', error);
            await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
        }
    }
};
