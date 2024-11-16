export default {
	name: "interactionCreate",
	once: false,

	async init(client, interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands?.get(interaction.commandName);

		interaction.c = await client.getUserData(interaction.user.id);

		if (!command) {
			return interaction.reply({
				content: client.t(interaction.c.lang, "errors.command.cmdNoExist"),
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