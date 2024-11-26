import Discord from "discord.js";
import { footer } from "../../functions.js";
import guild from "../../../models/guild.js";

export default async (client, interaction, d, btnInt, Sconfig) => {
    let config
    try {
    const userData = await guild.findOne({ guild: interaction.guild.id });
    config = userData.config;
    } catch {
        config = Sconfig;
    }

    async function configResponse() {
        const userData = await guild.findOne({ guild: interaction.guild.id });
        const config = userData.config;

        const list = Object.entries(config).map(([key, value]) => `> **${key}:** ${value}`);
        const sK = ["main_chat", "main_role"]; // Add your special keys here
        const modifiedList = list.map(item => {
            const [key, value] = item.split(": ");
            const cleanKey = key.replace("> **", "").replace("**", "");
            console.log(cleanKey);
            if (sK.includes(cleanKey)) {
            if (cleanKey === sK[0]) {
                return `> **Main chat:** <#${value}>`;
            } else if (cleanKey === sK[1]) {
                return `> **Main role:** <@&${value}>`;
            }
            }
            return item;
        });
        const embed = new Discord.EmbedBuilder()
        .setTitle("⚙️ Edit Configurations")
        .setDescription("> Here is your current configurations! Use the menu below to edit each one!\n\n" + modifiedList.join("\n"))
        .setFooter(footer("There will always be more configs as time goes on"))
        .setColor(d.colour);

    const row1 = new Discord.StringSelectMenuBuilder()
        .setCustomId('editConfig')
        .setPlaceholder('General')
        .addOptions(
            // max of 25
            new Discord.StringSelectMenuOptionBuilder()
                .setLabel('Main chat')
                .setDescription('Your main chat channel')
                .setValue('main_chat')
                .setEmoji('<:T_pinkarrow:1256904738239287386>')
        )
        .setDisabled(false);
    const row2 = new Discord.StringSelectMenuBuilder()
        .setCustomId('editConfig2')
        .setPlaceholder('soon')
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
            .setTitle("⚙️ Server Configuration")
            .setDescription(">>> Welcome to your user settings! Please use the menu below to navigate!")
            .setColor(d.colour)
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
            const list = Object.entries(config).map(([key, value]) => `> **${key}:** ${value}`);
            const sK = ["main_chat", "main_role"]; // Add your special keys here
            const modifiedList = list.map(item => {
                const [key, value] = item.split(": ");
                const cleanKey = key.replace("> **", "").replace("**", "");
                console.log(cleanKey);
                if (sK.includes(cleanKey)) {
                if (cleanKey === sK[0]) {
                    return `> **Main chat:** <#${value}>`;
                } else if (cleanKey === sK[1]) {
                    return `> **Main role:** <@&${value}>`;
                }
                }
                return item;
            });

            embed.setDescription("> Here is your current configurations down below!\n\n" + modifiedList.join("\n"));
            const msgx = await interaction.editReply({ embeds: [embed], components: [row, backBtn] });
            const backCollector = msgx.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 300000 });

            backCollector.on('collect', async i => {
                const defaultEmbed = new Discord.EmbedBuilder()
                    .setTitle("⚙️ Server Configuration")
                    .setDescription(">>> Welcome to your server settings! Please use the menu below to navigate!")
                    .setColor(d.colour)
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
            let data = config || await guild.findOne({ guild: i.guild.id });

            if (!data) {
                const newData = new user({
                    guild: i.guild.id,
                });

                await newData.save();
                data = await guild.findOne({ guild: i.guild.id });
            }

            const list = Object.entries(config).map(([key, value]) => `> **${key}:** ${value}`);
            const sK = ["main_chat", "main_role"]; // Add your special keys here
            const modifiedList = list.map(item => {
                const [key, value] = item.split(": ");
                const cleanKey = key.replace("> **", "").replace("**", "");
                console.log(cleanKey);
                if (sK.includes(cleanKey)) {
                if (cleanKey === sK[0]) {
                    return `> **Main chat:** <#${value}>`;
                } else if (cleanKey === sK[1]) {
                    return `> **Main role:** <@&${value}>`;
                }
                }
                return item;
            });
            await i.deferUpdate();

            const embed = new Discord.EmbedBuilder()
                .setTitle("⚙️ Edit Configurations")
                .setDescription("> Here is your current configurations! Use the menu below to edit each one!\n\n" + modifiedList.join("\n"))
                .setFooter(footer("There will always be more configs as time goes on"))
                .setColor(d.colour);

            const row1 = new Discord.StringSelectMenuBuilder()
                .setCustomId('editConfig')
                .setPlaceholder('General')
                .addOptions(
                    new Discord.StringSelectMenuOptionBuilder()
                        .setLabel('Main chat')
                        .setDescription('Change the colour of your embeds!')
                        .setValue('main_chat')
                        .setEmoji('<:T_pinkarrow:1256904738239287386>')
                )
                .setDisabled(false);
            const row2 = new Discord.StringSelectMenuBuilder()
                .setCustomId('editConfig2')
                .setPlaceholder('soon')
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
                if (a.guild.id !== interaction.guild.id) {
                    mU.resetTimer();
                    return a.reply({ content: "This is not yours", ephemeral: true });
                }

                try {
                    mU.resetTimer();
                    const h = await import("./handler-server.js");
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
                if (i.guild.id !== interaction.guild.id) {
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
                if (i.guild.id !== interaction.guild.id) {
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
