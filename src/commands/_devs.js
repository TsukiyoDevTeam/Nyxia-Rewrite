import { SlashCommandBuilder } from 'discord.js';
import { handleCmd } from "../utils/functions.js";

export default {
    dev: true,
    owner: false,
    category: "Developer",

    data: new SlashCommandBuilder()
        .setName('devs')
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
                .addStringOption(option =>
                    option
                        .setName('')
                        .setDescription('🛠️ ')
                        .setRequired(false)
                )
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
