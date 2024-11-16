import Logger from '../../utils/Logger.js';

export default {
	name: "ready",
	once: true,

	async init(client) {
		Logger.info("Bot", "Ready!");

	},
};