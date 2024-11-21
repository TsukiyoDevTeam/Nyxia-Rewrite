import { SlashCommandBuilder } from 'discord.js';
import { handleCmd } from "../utils/functions.js";
import t from "../utils/translator.js";

export default {
    dev: false,
    owner: false,
    category: "AFK",

    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('💤 Interact with the AFK system')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('💤 Set your AFK in the server or globally')

                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('💤 The reason you are AFK')
                        .setRequired(true)
                )
                .addBooleanOption(option =>
                    option
                        .setName('global')
                        .setDescription('💤 Set your AFK globally')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('💤 List all AFK users in the server')
        )
,
    async init(interaction, client, c) {
        try {
            await handleCmd(client, interaction, c);
            return;
        } catch (e) {
            return interaction.reply(t(c.lang, "errors.normal"))
        }
    }
};
