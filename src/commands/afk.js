import { SlashCommandBuilder } from 'discord.js';
import model from '../models/user.js';

export default {
    dev: true,
    owner: false,
    category: "Utility",

    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('💤 Set your AFK status')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set your AFK status')
                .addBooleanOption(option => 
                    option
                        .setName('global') // name of the option
                        .setDescription('Globally or just this server?') // description of the option
                        .setRequired(true) // required?
                )
                .addStringOption(option => 
                    option
                        .setName('status') // name of the option
                        .setDescription('Your AFK message. (REMEMBER TO BE RESPECTFUL!)') // description of the option
                        .setRequired(true) // required?
                )
        ),
    async init(interaction, client) {
        const t = client.t;
        const data = await model.findOne({
            user: interaction.user.id
        });

        if (!data) {
            const afkMsg = interaction.options.getString('status');
            const x = await new model({
                user: interaction.user.id,
                afk: {
                    message: afkMsg,
                    time: new Date().getTime(),
                    global: interaction.options.getBoolean('global')
                }
            });
            await x.save();
        }

        const embed = new EmbedBuilder()
            .setTitle(t());
    },
};
