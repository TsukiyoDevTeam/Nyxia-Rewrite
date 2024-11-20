import Logger from '../../utils/logger.js';
import t from "../../utils/translator.js";
import "colors"

export default {
	name: "ready",
	once: true,

	async init(client) {
		Logger.info("Bot", "Ready!");
		//client.emit("cron-botStats", client);
	},
};