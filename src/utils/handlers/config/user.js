import Discord from "discord.js";
import { footer } from "../../functions.js";

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

    const panelMsg = await interaction.editReply({ embeds: [embed], components: [row] });

    const menuCollector = panelMsg.createMessageComponentCollector({ componentType: Discord.ComponentType.StringSelect, time: 30000 });

// ------------------------------------------------------------

    menuCollector.on('collect', async i => {
        if (i.user.id !== interaction.user.id) {
            menuCollector.resetTimer();
            return i.reply({ content: "This is not yours", ephemeral: true });
        }

        menuCollector.resetTimer();

        if (i.values[0] === "view") {
            await handleView(interaction, config, embed, row);
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
};

// ------------------------------------------------------------

async function handleView(interaction, config, embed, row) {
    let fields = [];
    let count = 0;
    let field = { name: '\u200B', value: '', inline: true };

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
    await interaction.editReply({ embeds: [embed], components: [row] });
}

async function handleEdit(i) {
    await i.reply({ content: "soon", ephemeral: true }).catch(() => {});
}