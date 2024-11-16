import t from "../../utils/Translator.js";

export default {
	name: "interactionCreate",
	once: false,

	async init(client, interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands?.get(interaction.commandName);

		const configs = await client.getUserData(interaction.user.id);
		console.log(t(configs.lang, "utils.bot.name"));

		if (!command) {
			return interaction.reply({
				content: t(configs.lang, "errors.cmdNoExist"),
				ephemeral: true,
			});
		}

		if (command.owner) {
			const owner = await client.users.cache.get(interaction.guild.ownerId);
			if (interaction.user.id !== owner.id) {
				return interaction.reply({
					content: eval(t(configs.lang, "errors.notServerOwner")).replace("{owner}", owner),
					ephemeral: true,
				});
			}
		}

		if (command.dev && !client.devs.includes(interaction.user.id)) {
			return interaction.reply({
				content: eval(t(configs.lang, "errors.notDev")),
				ephemeral: true,
			});
		}

		try {
			await command.init(interaction, client, configs);
		} catch (error) {
			console.error(error);
			const replyOptions = { content: 'There was an error while executing this command!', ephemeral: true };
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(replyOptions);
			} else {
				await interaction.reply(replyOptions);
			}
		}
	},

};