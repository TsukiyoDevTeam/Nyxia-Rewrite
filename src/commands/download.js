import { SlashCommandBuilder } from 'discord.js';
import { handleCmd } from "../utils/functions.js";

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
                .setDescription('📂 Download user data from the bot')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('📂 Download server data from the bot')
        )
,
    async init(interaction, client, c, t) {
        try {
            await handleCmd(client, interaction, c);
            return;
        } catch (e) {
            return interaction.reply("something went wrong")
        }
    }
};
