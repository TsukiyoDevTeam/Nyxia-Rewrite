import { SlashCommandBuilder } from 'discord.js';
import { handleCmd } from "../utils/functions.js";

export default {
    dev: true,
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
,
    async init(interaction, client, c, t) {
        try {
            await handleCmd(client, interaction, c);
            return;
        } catch (e) {
            return interaction.reply(t(c.lang, "errors.normal"))
        }
    }
};
