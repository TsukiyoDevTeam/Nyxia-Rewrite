import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Discord from "discord.js";
import "colors";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", 'package.json'), 'utf-8'));

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
    return cmd.default(client, interaction, config);
}

/**
 * Creates a paginated leaderboard embed with navigation buttons. Just remember that this handles the rest of the interactions so it should be final.
 *
 * @param {string} title - The title of the leaderboard.
 * @param {string[]} txt - The leaderboard data as an array of strings.
 * @param {Discord.Interaction|Discord.Message} interaction - The interaction or message that triggered the leaderboard creation.
 * @param {Object} config - Configuration object containing settings like color.
 * @param {boolean} [single=false] - Whether to display a single item per page.
 * @param {number} [pageCount=10] - Number of items to display per page.
 * @returns {Promise<void>} A promise that resolves when the leaderboard is created.
 * @example
 * ```js
 * const array = ["1", "2", "3"];
 * return await createLeaderboard("List", array, interaction, config, 1)
 * ```
 */
export const createLeaderboard = async (title, txt, interaction, config, pageCount = 10) => {
    let lb;
    let failed = false;
    let single = false;
    if (pageCount === 1) {
        single = true;
    }
    if (txt?.length === 0 || !txt || txt === "") {
        lb = ["Invalid data was provided"];
        failed = true;
    } else {
        lb = txt;
    }
    if (!lb) {
        lb = ["Invalid data was provided"];
        failed = true;
    }
    const generateEmbed = async (start, lb, title) => {
        const itemsPerPage = single ? 1 : pageCount;
        const current = lb.slice(start, start + itemsPerPage).join("\n");
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

    const createButton = (id, label, disabled = false) => new Discord.ButtonBuilder().setCustomId(id).setLabel(label).setStyle(Discord.ButtonStyle.Secondary).setDisabled(disabled);

    const totalPages = Math.ceil(single ? lb.length : (lb.length / pageCount));
    const row = new Discord.ActionRowBuilder().addComponents(
        createButton("back_button", "prev", true),
        createButton("page_info", `1/${totalPages}`, totalPages === 1),
        createButton("forward_button", "next", lb.length <= pageCount)
    );

    let msg = isMessage ? await interaction.reply({ ...replyOptions, components: [row] }) : (interaction.deferred || interaction.replied) ? await interaction.editReply({ ...replyOptions, components: [row] }) : await interaction.reply({ ...replyOptions, components: [row] });

    // safeguard
    if (failed) return;

    let currentIndex = 0;
    const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 60000 });

    collector.on("collect", async (btn) => {
        if (btn.user.id === (isMessage ? interaction.author.id : interaction.user.id)) {
            if (btn.customId === "page_info") {
                const modal = new Discord.ModalBuilder()
                    .setCustomId("page_modal")
                    .setTitle("Page Indexer")
                    .addComponents(
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.TextInputBuilder()
                                .setCustomId("page_number")
                                .setLabel(" ")
                                .setPlaceholder("Please provide the page number you wish to visit")
                                .setStyle(Discord.TextInputStyle.Short)
                                .setRequired(true)
                        )
                    );

                await btn.showModal(modal);
                const modalSubmit = await btn.awaitModalSubmit({ time: 15000 }).catch(() => null);

                if (modalSubmit) {
                    const pageNumber = parseInt(modalSubmit.fields.getTextInputValue("page_number"), 10);
                    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
                        await modalSubmit.reply({ content: "Invalid page number.", ephemeral: true });
                    } else {
                        currentIndex = (pageNumber - 1) * pageCount;
                        const row2 = new Discord.ActionRowBuilder().addComponents(
                            createButton("back_button", "prev", currentIndex === 0),
                            createButton("page_info", `${pageNumber}/${totalPages}`, totalPages === 1),
                            createButton("forward_button", "next", currentIndex + (single ? 1 : pageCount) >= lb.length)
                        );

                        await Promise.all([
                            msg.edit({ embeds: [await generateEmbed(currentIndex, lb, title)], components: [row2] }),
                            modalSubmit.deferUpdate()
                        ]);
                        collector.resetTimer();
                    }
                }
            } else {
                currentIndex += btn.customId === "back_button" ? -pageCount : pageCount;

                const row2 = new Discord.ActionRowBuilder().addComponents(
                    createButton("back_button", "prev", currentIndex === 0),
                    createButton("page_info", `${Math.floor(currentIndex / (single ? 1 : pageCount)) + 1}/${totalPages}`, totalPages === 1),
                    createButton("forward_button", "next", currentIndex + (single ? 1 : pageCount) >= lb.length)
                );

                await Promise.all([
                    msg.edit({ embeds: [await generateEmbed(currentIndex, lb, title)], components: [row2] }),
                    btn.deferUpdate()
                ]);
                collector.resetTimer();
            }
        } else {
            await btn.reply({ content: "This isn't for you", ephemeral: true });
            collector.resetTimer();
        }
    });

    collector.on("end", async () => {
        const rowDisable = new Discord.ActionRowBuilder().addComponents(
            createButton("expired_button", "This component has expired!", true),
        );

        await msg.edit({ components: [rowDisable] });
    });
};

/**
 * Generated the embed footer with the provided text and icon.
 *
 * @param {string} text - (optional) Extra footer text
 * @param {string} pic - Must be a url
 * @returns {Object} The footer for embeds
 * @example
 * ```js
 * .setFooter(footer("text", interaction.user.displayAvatarUrl()))
 * ```
 */
export const footer = (text, pic) => ({
    text: `${text ? `${text}\n` : ''}© Dreamwxve 2024 | ${packageJson.version}`,
    iconURL: pic || null
});
