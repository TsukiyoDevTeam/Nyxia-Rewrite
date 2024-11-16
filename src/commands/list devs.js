import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Logger from '../utils/Logger.js';

export default {
    dev: true,
    owner: false,
    category: "Miscellaneous",
    
    data: new SlashCommandBuilder()
        .setName('list-devs')
        .setDescription('🔨 List the development team of Nyxia'),
        
    async init(interaction, client, c) {
        try {
            const devs = await model.find({ badges: { $in: ["Developer"] } });
            const translators = await model.find({ badges: { $in: ["Translator"] } });
            
            const fetchUserStatus = async (userId) => {
                const user = await client.users.fetch(userId).catch(() => null);
                if (!user) return null;
                const member = await interaction.guild.members.fetch(user.id).catch(() => null);
                const statusEmoji = member ? '`✅`' : '`❌`';
                return `${statusEmoji} **|** <@${userId}> \`${user.username}\``;
            };

            const userList = await Promise.all(devs.map(dev => dev.User !== "981755777754755122" ? fetchUserStatus(dev.User) : null));
            const translatorList = await Promise.all(translators.map(translator => fetchUserStatus(translator.User)));

            const me = await fetchUserStatus("981755777754755122");
            const contributingDevs = userList.filter(Boolean).join('\n');
            const contributingTranslators = translatorList.filter(Boolean).join('\n');

            const embed = new EmbedBuilder()
                .setTitle("Nyxia Development Team")
                .setColor("#f6bbcd")
                .setDescription(`These are the people who maintain the development of Nyxia!\n> <:enable_1:1206754451818553364><:enable_2:1206754477152145438> - In Server\n> <:disable_1:1206754389805637682><:disable_2:1206754421590065152> - Not in server`)
                .setFooter(client.footer())
                .addFields(
                    {
                        name: "__Lead Developer__",
                        value: `> ${me}`,
                        inline: false
                    },
                    {
                        name: "__Contributing Devs__",
                        value: `>>> ${contributingDevs}`,
                        inline: false
                    },
                    {
                        name: "__Translators__",
                        value: `>>> ${contributingTranslators}`,
                        inline: false
                    }
                );

            return interaction.reply({embeds: [embed]});
        } catch (err) {
            Logger.error("Cmd - ListDevs", "Something went wrong with fetching the developer list. Might be a simple glitch or connection issue. If it persists, contact a developer.", err);
            return interaction.reply(
                {
                    embeds: [
                        new EmbedBuilder()
                           .setTitle("An error occurred")
                           .setColor("#ff0000")
                           .setDescription("An error occurred while fetching the developer list.")
                           .setFooter({text: "footer text"})
                    ]
                }
            );
        }
    }
};
