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
 * @param {Object} b - The client instance.
 * @param {Object} i - The interaction object.
 * @param {Object} c - The configuration settings.
 * @returns {Promise<void>} A promise that resolves when the command is handled.
 */
export const handleCmd = async (b, i, c) => {
    const x = i.commandName;
    const y = i.options?.getSubcommand() || null;
    const z = i.options?.getSubcommandGroup() || null;
    let filePath = path.join(__dirname, "../commands");
    if (x) filePath = path.join(filePath, x);
    if (z) filePath = path.join(filePath, z);
    if (y) filePath = path.join(filePath, y + ".js");
    else filePath = path.join(filePath, ".js");

    console.log(String(filePath).yellow)

    const cmd = await import(filePath);
    // (client, interaction, t, c) 
    return cmd.default(b, i, t, c);
}