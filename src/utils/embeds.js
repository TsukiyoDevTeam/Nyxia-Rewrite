import { EmbedBuilder, ButtonStyle } from "discord.js";
import { footer } from "./functions.js";

/**
 * Creates an error embed message.
 *
 * @param {string} message - The message content of the embed.
 * @param {Error} error - The error object. Is allowed to be null.
 * @param {object} source - The source object that triggered for example interaction or message.
 * @returns {EmbedBuilder} EmbedBuiler instance.
 * @example
 * ```js
 * // use natively
 * message.reply({embeds: [errEmbed("Error message", null, message)]});
 * // or
 * const embed = errEmbed("Error message", null, source);
 * 
 * // use in try-catch
 * try {
 * 	// code here ..
 * } catch (error) {
 * 	return interaction.reply({embeds: [errEmbed("Error message"), error, interaction]})
 * }
 * ```
 */
export const errEmbed = (message, error, source) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
    	code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const embed = new EmbedBuilder()
        .setColor("DarkRed")
		.setTitle("Oops.. something went wrong")
		.setDescription("> " + message)
		.setFooter(footer("If you cannot solve this error, please report it in our support server below", null))
		.setFields(
			{
				name: "__Error Code__",
				value: "> " + code,
				inline: true
			}
		);
};