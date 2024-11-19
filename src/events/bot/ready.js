import Logger from '../../utils/Logger.js';
import t from "../../utils/Translator.js";
import "colors"

export default {
	name: "ready",
	once: true,

	async init(client) {
		Logger.info("Bot", "Ready!");
		client.emit("cron-botStats", client)
	},
};