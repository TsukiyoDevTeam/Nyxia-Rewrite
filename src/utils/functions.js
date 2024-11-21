import t from "./translator.js";
import Logger from "./logger.js";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Discord from "discord.js";
import "colors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Handles a command interaction.
 *
 * @param {Discord.Client} client - The client instance.
 * @param {Discord.ChatInputCommandInteraction} interaction - The interaction object.
 * @param {object} config - The configuration settings.
 * @example
 * handleCmd(client, interaction, config);
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

/**
 * Creates a paginated leaderboard embed with navigation buttons. This also handles the final reply of the interaction.
 *
 * @param {string} title - The title of the leaderboard
 * @param {Array<string>} lb - The leaderboard data as an array of strings
 * @param {Discord.Message | Discord.Interaction} interaction - The interaction or message that triggered the leaderboard creation
 * @param {object} config - Configuration object
 * 
 */
export const createLeaderboard = async (title, lb, interaction, config) => {
    const generateEmbed = async (start, lb, title) => {
        const current = lb.slice(start, start + 10).join("\n");
        return new Discord.EmbedBuilder()
            .setTitle(title)
            .setDescription(current)
            .setColor(config.colour);
    };

    const isMessage = interaction instanceof Discord.Message;
    const replyOptions = {
        embeds: [await generateEmbed(0, lb, title)],
        fetchReply: true,
    };

    let msg = isMessage ? await interaction.reply(replyOptions) : (interaction.deferred || interaction.replied) ? await interaction.editReply(replyOptions) : await interaction.reply(replyOptions);

    if (lb.length <= 10) return;

    const createButton = (id, label, disabled = false) => new Discord.ButtonBuilder().setCustomId(id).setLabel(label).setStyle(Discord.ButtonStyle.Secondary).setDisabled(disabled);

    const row = new Discord.ActionRowBuilder().addComponents(
        createButton("back_button", "prev", true),
        createButton("page_info", `1/${Math.ceil(lb.length / 10)}`, true),
        createButton("forward_button", "next")
    );

    await msg.edit({ embeds: [await generateEmbed(0, lb, title)], components: [row] });

    let currentIndex = 0;
    const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 60000 });

    collector.on("collect", async (btn) => {
        if (btn.user.id === (isMessage ? interaction.author.id : interaction.user.id)) {
            currentIndex += btn.customId === "back_button" ? -10 : 10;

            const row2 = new Discord.ActionRowBuilder().addComponents(
                createButton("back_button", "prev", currentIndex === 0),
                createButton("page_info", `${Math.floor(currentIndex / 10) + 1}/${Math.ceil(lb.length / 10)}`, true),
                createButton("forward_button", "next", currentIndex + 10 >= lb.length)
            );

            await msg.edit({ embeds: [await generateEmbed(currentIndex, lb, title)], components: [row2] });
            await btn.deferUpdate();
            collector.resetTimer();
        }
    });

    collector.on("end", async () => {
        const rowDisable = new Discord.ActionRowBuilder().addComponents(
            createButton("back_button", "prev", true),
            createButton("page_info", `${Math.floor(currentIndex / 10) + 1}/${Math.ceil(lb.length / 10)}`, true),
            createButton("forward_button", "next", true)
        );

        await msg.edit({ embeds: [await generateEmbed(currentIndex, lb, title)], components: [rowDisable] });
    });
};
