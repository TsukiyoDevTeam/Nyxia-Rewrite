import t from "./translator.js";
import Logger from "./logger.js";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Discord from "discord.js";
import "colors"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Handles a command interaction.
 *
 * @param {Object} client - The client instance.
 * @param {Object} interaction - The interaction object.
 * @param {Object} config - The configuration settings.
 * @returns {Promise<void>} A promise that resolves when the command is handled.
 */
export const handleCmd = async (client, interaction, config) => {
    const x = interaction.commandName;
    const y = interaction.options?.getSubcommand() || null;
    const z = interaction.options?.getSubcommandGroup() || null;
    let filePath = path.join(__dirname, "..", "commands", "src");
    if (x) filePath = path.join(filePath, x);
    if (z) filePath = path.join(filePath, z);
    if (y) filePath = path.join(filePath, y + ".js");
    else filePath = path.join(filePath, ".js");

    const cmd = await import("file://" + filePath);
    return cmd.default(client, interaction, t, config);
}

export const createLeaderboard = async (title, lb, interaction, config) => {
    const generateEmbed = async (start, end, lb, title, interaction) => {
        const current = lb.slice(start, end + 10);
        const result = current.join("\n");

        let embed = new Discord.EmbedBuilder()
            .setTitle(`${title}`)
            .setDescription(`${result.toString()}`)
            .setColor(config.colour);

        return embed;
    };

    const isMessage = interaction instanceof Discord.Message;

    const replyOptions = {
        embeds: [await generateEmbed(0, 0, lb, title, interaction)],
        fetchReply: true,
    };

    let msg;
    if (isMessage) {
        msg = await interaction.reply(replyOptions);
    } else {
        if (interaction.deferred || interaction.replied) {
            msg = await interaction.editReply(replyOptions);
        } else {
            msg = await interaction.reply(replyOptions);
        }
    }

    if (lb.length <= 10) return;

    const button1 = new Discord.ButtonBuilder()
        .setCustomId("back_button")
        .setEmoji("⬅️")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setDisabled(true);

    const button2 = new Discord.ButtonBuilder()
        .setCustomId("forward_button")
        .setEmoji("➡️")
        .setStyle(Discord.ButtonStyle.Secondary);

    const row = new Discord.ActionRowBuilder().addComponents(button1, button2);

    await msg.edit({
        embeds: [await generateEmbed(0, 0, lb, title, interaction)],
        components: [row],
    });

    let currentIndex = 0;
    const collector = msg.createMessageComponentCollector({
        componentType: Discord.ComponentType.Button,
        time: 60000,
    });

    collector.on("collect", async (btn) => {
        if (btn.user.id === (isMessage ? interaction.author.id : interaction.user.id)) {
            btn.customId === "back_button" ? (currentIndex -= 10) : (currentIndex += 10);

            const btn1 = new Discord.ButtonBuilder()
                .setCustomId("back_button")
                .setEmoji("⬅️")
                .setStyle(Discord.ButtonStyle.Secondary)
                .setDisabled(currentIndex === 0);

            const btn2 = new Discord.ButtonBuilder()
                .setCustomId("forward_button")
                .setEmoji("➡️")
                .setStyle(Discord.ButtonStyle.Secondary)
                .setDisabled(currentIndex + 10 >= lb.length);

            const row2 = new Discord.ActionRowBuilder().addComponents(btn1, btn2);

            await msg.edit({
                embeds: [await generateEmbed(currentIndex, currentIndex, lb, title, interaction)],
                components: [row2],
            });
            await btn.deferUpdate();
        }
    });

    collector.on("end", async () => {
        const btn1Disable = new Discord.ButtonBuilder()
            .setCustomId("back_button")
            .setEmoji("⬅️")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setDisabled(true);

        const btn2Disable = new Discord.ButtonBuilder()
            .setCustomId("forward_button")
            .setEmoji("➡️")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setDisabled(true);

        const rowDisable = new Discord.ActionRowBuilder().addComponents(btn1Disable, btn2Disable);

        await msg.edit({
            embeds: [await generateEmbed(currentIndex, currentIndex, lb, title, interaction)],
            components: [rowDisable],
        });
    });
};
