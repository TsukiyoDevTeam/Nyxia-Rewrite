import userModel from "../../models/user.js";
import t from "../../utils/translator.js";
import Discord from "discord.js";

export default {
	name: "interactionCreate",
	once: false,

	async init(client, interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands?.get(interaction.commandName);
		if (!command) {
			return interaction.reply({
				content: t(configs.config.lang, "errors.cmdNoExist"),
				ephemeral: true,
			});
		}

		const configs = await getUserInfo(interaction.user.id);
		const userBans = configs?.isBannedFrom || [];

		if (userBans.some(ban => ban.commandName === interaction.commandName)) {
			const banReason = userBans.find(ban => ban.commandName === interaction.commandName).reason;
			const embed = new Discord.EmbedBuilder()
				.setDescription(t(configs.config.lang, "errors.cmdBanned.desc").replace("{reason}", banReason))
				.setColor("#f04a41");

			return  interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (await isNotOwner(command, interaction, client, configs)) {
			return;
		};
		if (isNotDev(command, interaction, client, configs)) {
			return;
		};

		try {
			await command.init(interaction, client, configs.config, t);
		} catch (error) {
			console.log(error)
			const replyOptions = { content: t(configs.config.lang, "errors.normal") + "\n>>> " + error.message, ephemeral: false };
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(replyOptions);
			} else {
				await interaction.reply(replyOptions);
			}
		}
	},
};

async function getUserInfo(userId) {
		let configs = await userModel.findOne({ user: userId });
		if (!configs) {
			configs = new userModel({ user: userId, config: {} });
			await configs.save();
		} else if (!configs.config) {
			configs.config = {};
			await configs.save();
		}
		return configs;
}

async function isNotOwner(command, interaction, client, configs) {
	if (!command.owner) return false;

	const guild = interaction.guild;
	if (!guild) {
		await interaction.reply({
			content: t(configs.lang, "errors.guildNotFound"),
			ephemeral: true,
		});
		return true;
	}

	const owner = await client.users.cache.get(guild.ownerId);
	if (!owner || interaction.user.id !== owner.id) {
		await interaction.reply({
			content: t(configs.lang, "errors.notServerOwner").replace("{owner}", owner),
			ephemeral: true,
		});
		return true;
	}

	return false;
}

function isNotDev(command, interaction, client, configs) {
	if (command.dev && !client.devs.includes(interaction.user.id)) {
		interaction.reply({
			content: t(configs.lang, "errors.notDev"),
			ephemeral: true,
		});
		return true;
	}
	return false;
}
