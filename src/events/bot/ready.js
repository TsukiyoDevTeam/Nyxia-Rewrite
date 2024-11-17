import Logger from '../../utils/Logger.js';

export default {
	name: "ready",
	once: true,

	async init(t, client) {
		Logger.info("Bot", "Ready!");

	},
};