import { SlashCommandBuilder } from 'discord.js';
import model from '../models/user.js';
import t from '../utils/Translator.js';

export default {
    dev: true,
    owner: true,
    category: "Developer",

    data: new SlashCommandBuilder()
        .setName('test-cmd')
        .setDescription('A command to test the bot functionality'),

    async init(interaction, client, c) {
        try {
            const data = await model.findOne({ user: interaction.user.id });
            if (data) {
                return interaction.reply(`\`\`\`json\n${data.toString()}\`\`\``);
            } else {
                const newUser = new model({
                    user: interaction.user.id,
                });
                await newUser.save();
                return interaction.reply(`\`\`\`json\n${newUser.toString()}\`\`\``);
            }
        } catch (error) {
            console.error(error);
            return interaction.reply(t(c.lang, "errors.normal"));
        }
    },
};
