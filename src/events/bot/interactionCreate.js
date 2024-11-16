export default {
	name: "interactionCreate",
	once: false,

	async init(client, interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands?.get(interaction.commandName);

		interaction.c = await client.getUserData(interaction.user.id);

		if (!command) {
			return interaction.reply({
				content: client.t(interaction.c.lang, "errors.cmdNoExist"),
				ephemeral: true,
			});
		}

		if (command.owner) {
			const owner = await client.users.cache.get(interaction.guild.ownerId);
			if (interaction.user.id !== owner.id) {
				return interaction.reply({
					content: client.t(interaction.c.lang, "errors.notServerOwner").replace("{owner}", owner),
					ephemeral: true,
				});
			}
		}

		if (command.dev && !client.devs.includes(interaction.user.id)) {
			return interaction.reply({
				content: client.t(interaction.c.lang, "errors.notDev"),
				ephemeral: true,
			});
		}

		try {
			await command.init(interaction, client);
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