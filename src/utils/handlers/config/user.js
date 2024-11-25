import Discord from "discord.js";
import { footer } from "../../functions.js";
import user from "../../../models/user.js";

export default async (client, interaction, config, btnInt) => {
    try {
        await btnInt.deferUpdate();
        let embed = new Discord.EmbedBuilder()
            .setTitle("⚙️ User Configuration")
            .setDescription(">>> Welcome to your user settings! Please use the menu below to navigate!")
            .setColor(config.colour)
            .setFooter(footer());

        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('settings')
                    .setPlaceholder('Select a setting')
                    .addOptions(
                        new Discord.StringSelectMenuOptionBuilder()
                            .setLabel('View current configs')
                            .setDescription('View your current configs!')
                            .setValue('view'),
                        new Discord.StringSelectMenuOptionBuilder()
                            .setLabel('Edit current configs')
                            .setDescription('Edit your current configs!')
                            .setValue('edit')
                    )
            );

        const backBtn = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel('Back')
                    .setCustomId('backBtn')
                    .setStyle(Discord.ButtonStyle.Secondary)
            );

        const panelMsg = await interaction.editReply({ embeds: [embed], components: [row] });

        const menuCollector = panelMsg.createMessageComponentCollector({ componentType: Discord.ComponentType.StringSelect, time: 30000 });

        menuCollector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                menuCollector.resetTimer();
                return i.reply({ content: "This is not yours", ephemeral: true });
            }

            menuCollector.resetTimer();

            if (i.values[0] === "view") {
                await handleView(interaction, config, embed, row, backBtn);
                await i.deferUpdate();
            } else if (i.values[0] === "edit") {
                await handleEdit(i);
            }
        });

        menuCollector.on('end', () => {
            try {
                interaction.editReply({ components: [] }).catch(() => {});
            } catch {}
        });

        async function handleView(interaction, config, embed, row, backBtn) {
            let fields = [];
            let count = 0;
            let field = { name: '----------', value: '', inline: true };

            for (const [x, y] of Object.entries(config)) {
                field.value += `**${x}**: ${y}\n`;
                count++;

                if (count === 5) {
                    fields.push(field);
                    field = { name: '\u200B', value: '', inline: true };
                    count = 0;
                }
            }

            if (count > 0) {
                fields.push(field);
            }

            embed.setFields(fields);
            embed.setDescription("> Here is your current configurations down below!");
            const msgx = await interaction.editReply({ embeds: [embed], components: [row, backBtn] });
            const backCollector = msgx.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 30000 });

            backCollector.on('collect', async i => {
                const defaultEmbed = new Discord.EmbedBuilder()
                    .setTitle("⚙️ User Configuration")
                    .setDescription(">>> Welcome to your user settings! Please use the menu below to navigate!")
                    .setColor(config.colour)
                    .setFooter(footer());

                const defaultRow = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId('settings')
                            .setPlaceholder('Select a setting')
                            .addOptions(
                                new Discord.StringSelectMenuOptionBuilder()
                                    .setLabel('View current configs')
                                    .setDescription('View your current configs!')
                                    .setValue('view'),
                                new Discord.StringSelectMenuOptionBuilder()
                                    .setLabel('Edit current configs')
                                    .setDescription('Edit your current configs!')
                                    .setValue('edit')
                            )
                    );

                await interaction.editReply({ embeds: [defaultEmbed], components: [defaultRow] });
                try {
                    await i.deferUpdate();
                    return;
                } catch { return; }
            });
        }

        async function handleEdit(i) {
            let data = config || await user.findOne({ user: i.user.id });

            if (!data) {
                const newData = new user({
                    user: interaction.user.id,
                });

                await newData.save();
                data = await user.findOne({ user: interaction.user.id });
            }

            const list = Object.entries(config).map(([key, value]) => `> **${key}:** ${value}`);
            await i.deferUpdate();

            const embed = new Discord.EmbedBuilder()
                .setTitle("⚙️ Edit Configurations")
                .setDescription("> Here is your current configurations! Use the menu below to edit each one!\n\n" + list.join("\n"))
                .setFooter(footer("There will always be more configs as time goes on"))
                .setColor(config.colour);

            const row1 = new Discord.StringSelectMenuBuilder()
                .setCustomId('editConfig')
                .setPlaceholder('Personal')
                .addOptions(
                    new Discord.StringSelectMenuOptionBuilder()
                        .setLabel('Colour')
                        .setDescription('Change the colour of your embeds!')
                        .setValue('colour')
                        .setEmoji('<:T_pinkarrow:1256904738239287386>')
                )
                .setDisabled(false);
            const row2 = new Discord.StringSelectMenuBuilder()
                .setCustomId('editConfig2')
                .setPlaceholder('Preferences')
                .addOptions(
                    new Discord.StringSelectMenuOptionBuilder()
                        .setLabel('Colour')
                        .setDescription('Change the colour of your embeds!')
                        .setValue('colour')
                        .setEmoji('<:T_pinkarrow:1256904738239287386>')
                )
                .setDisabled(true);
            const row3 = new Discord.StringSelectMenuBuilder()
                .setCustomId('editConfig3')
                .setPlaceholder('soon')
                .addOptions(
                    new Discord.StringSelectMenuOptionBuilder()
                        .setLabel('Colour')
                        .setDescription('Change the colour of your embeds!')
                        .setValue('colour')
                        .setEmoji('<:T_pinkarrow:1256904738239287386>')
                )
                .setDisabled(true);

            const row4 = new Discord.StringSelectMenuBuilder()
                .setCustomId('editConfig4')
                .setPlaceholder('soon')
                .addOptions(
                    new Discord.StringSelectMenuOptionBuilder()
                        .setLabel('Colour')
                        .setDescription('Change the colour of your embeds!')
                        .setValue('colour')
                        .setEmoji('<:T_pinkarrow:1256904738239287386>')
                )
                .setDisabled(true);
            const row5 = new Discord.StringSelectMenuBuilder()
                .setCustomId('editConfig5')
                .setPlaceholder('soon')
                .addOptions(
                    new Discord.StringSelectMenuOptionBuilder()
                        .setLabel('Colour')
                        .setDescription('Change the colour of your embeds!')
                        .setValue('colour')
                        .setEmoji('<:T_pinkarrow:1256904738239287386>')
                )
                .setDisabled(true);

            const actionRow1 = new Discord.ActionRowBuilder().addComponents(row1);
            const actionRow2 = new Discord.ActionRowBuilder().addComponents(row2);
            const actionRow3 = new Discord.ActionRowBuilder().addComponents(row3);
            const actionRow4 = new Discord.ActionRowBuilder().addComponents(row4);
            const actionRow5 = new Discord.ActionRowBuilder().addComponents(row5);

            await interaction.editReply({ embeds: [embed], components: [actionRow1, actionRow2, actionRow3, actionRow4, actionRow5] });
        }
    } catch (e) {
        console.log(e);
    }
}
