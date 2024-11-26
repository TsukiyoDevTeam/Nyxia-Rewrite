import Discord from "discord.js";
import { footer } from "../../functions.js";
import user from "../../../models/user.js";

export default async (client, interaction, d, btnInt) => {
    let config
    try {
    const userData = await user.findOne({ user: interaction.user.id });
    config = userData.config;
    } catch {
        config = d;
    }

    async function configResponse() {
        const userData = await user.findOne({ user: interaction.user.id });
        const config = userData.config;
        const list = Object.entries(config).map(([key, value]) => `> **${key}:** ${value}`);
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

    return { embeds: [embed], components: [actionRow1, actionRow2, actionRow3, actionRow4, actionRow5] };
    }

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

        await startCollector(client, interaction, config, embed, row, backBtn);

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
            const backCollector = msgx.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 300000 });

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

            const msg = await interaction.editReply({ embeds: [embed], components: [actionRow1, actionRow2, actionRow3, actionRow4, actionRow5] });
            const mU = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.StringSelect, time: 300000 });

            mU.on('collect', async (a) => {
                if (a.user.id !== interaction.user.id) {
                    mU.resetTimer();
                    return a.reply({ content: "This is not yours", ephemeral: true });
                }

                try {
                    mU.resetTimer();
                    const h = await import("./handler-user.js");
                    await h.default(client, a, data);
                    await restartAfterMenu(client, interaction, config, embed, row);
                } catch (e) {
                    mU.resetTimer();
                    console.log(e);
                    return a.reply({ content: "An error occurred Please contact a developer", ephemeral: true });
                }
            });
        }

        async function startCollector(client, interaction, config, embed, row, backBtn) {
            const panelMsg = await interaction.editReply({ embeds: [embed], components: [row] });

            const menuCollector = panelMsg.createMessageComponentCollector({ componentType: Discord.ComponentType.StringSelect, time: 300000 });

            menuCollector.on('collect', async i => {
                if (i.user.id !== interaction.user.id) {
                    menuCollector.resetTimer();
                    return i.reply({ content: "This is not yours", ephemeral: true });
                }

                menuCollector.resetTimer();

                if (i.values[0] === "view") {
                    menuCollector.resetTimer();
                    await handleView(interaction, config, embed, row, backBtn);
                    await i.deferUpdate();
                } else if (i.values[0] === "edit") {
                    menuCollector.resetTimer();
                    await handleEdit(i);
                }
            });
        }

        async function restartAfterMenu(client, interaction, config, embed, row, backBtn) {
            const panelMsg = await interaction.editReply(await configResponse());

            const menuCollector = panelMsg.createMessageComponentCollector({ componentType: Discord.ComponentType.StringSelect, time: 300000 });

            menuCollector.on('collect', async i => {
                if (i.user.id !== interaction.user.id) {
                    menuCollector.resetTimer();
                    return i.reply({ content: "This is not yours", ephemeral: true });
                }

                menuCollector.resetTimer();

                if (i.values[0] === "view") {
                    menuCollector.resetTimer();
                    await handleView(interaction, config, embed, row, backBtn);
                    await i.deferUpdate();
                } else if (i.values[0] === "edit") {
                    menuCollector.resetTimer();
                    await handleEdit(i);
                }
            });
        }
    } catch (e) {
        console.log(e);
    }
}
