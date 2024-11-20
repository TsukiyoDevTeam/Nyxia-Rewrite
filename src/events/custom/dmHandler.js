import t from "../../utils/translator.js";

export default {
	name: "msg-dmHandler",
	once: false,

	async init(client, message) {
        if (message.user.id === "726304316830253117") {
            return message.reply("I love you so so much <3") // :D
        }
/*
        const confirmEmbed = new DiscordAPIError.EmbedBuiler()
            .setTitle(t())
*/
    }
}