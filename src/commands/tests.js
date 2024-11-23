import { SlashCommandBuilder } from 'discord.js';
import { handleCmd } from "../utils/functions.js";

export default {
    dev: false,
    owner: false,
    category: "Testing",

    data: new SlashCommandBuilder()
        .setName('tests')
        .setDescription('test commands')

        .addSubcommand(subcommand =>
            subcommand
                .setName('lb')
                .setDescription('description')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('listcmds')
                .setDescription('description')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('config')
                .setDescription('description')
        )
,
    async init(interaction, client, c) {
        try {
            await handleCmd(client, interaction, c);
            return;
        } catch (e) {
            console.log(e)
            return interaction.reply("something went wrong")
        }
    }
};
