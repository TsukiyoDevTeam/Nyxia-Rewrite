import Discord from "discord.js";
import { createLeaderboard, footer } from "../../functions.js";
import user from "../../../models/user.js";
import { config } from "dotenv";

export default async (client, interaction, config, btnInt) => {
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

//----------------------------------------------
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

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
async function handleEdit(i) {
    if (i.user.id !== interaction.user.id) {
        return i.reply({ content: "This is not yours", ephemeral: true });
    }
    let data = await user.findOne({ user: interaction.user.id });
    if (!data) {
        const newData = new user({
            user: interaction.user.id,
        });
        await newData.save();
        data = await user.findOne({ user: interaction.user.id });
    }
     
    const list = Object.entries(data.config).map(([key, value]) => `> **${key}:** ${value}`);
    await i.deferUpdate();
    await createLeaderboard("Current configurations", list, interaction, config, 5, backBtn);
}
};
/*
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

        return interaction.editReply({ embeds: [defaultEmbed], components: [defaultRow] });
    });
*/