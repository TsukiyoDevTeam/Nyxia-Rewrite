import t from "../../utils/translator.js";

export default {
	name: "interactionCreate",
	once: false,

	async init(client, message) {
        if (message.bot) return;

        if (!message.guild) {
            return client.emit("msg-dmHandler", (client, message));
        }
    }
}