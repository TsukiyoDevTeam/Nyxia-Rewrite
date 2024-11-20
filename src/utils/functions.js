import t from "./translator.js";
import Logger from "./logger.js";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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