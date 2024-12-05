import userModel from "../../models/user.js";
import guildModel from "../../models/guild.js";
import Discord from "discord.js";
import { footer } from "../../utils/functions.js";

export default {
	name: "interactionCreate",
	once: false,

	async init(client, interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands?.get(interaction.commandName);
		if (!command) {
			return interaction.reply({
				content: "Seems like this command doesn't exist",
				ephemeral: true,
			});
		}
		
		const Uconfigs = await getUserInfo(interaction.user.id);
		const userBans = Uconfigs?.flags?.isBannedFrom ? Uconfigs.flags.isBannedFrom : [];
		if (userBans.length > 0 && userBans.some(ban => ban.cmd === interaction.commandName)) {
			const data = userBans.find(ban => ban.cmd === interaction.commandName);
			const embed = new Discord.EmbedBuilder()
				.setDescription("Oh no! Looks like you have been banned from this command!\n**Reason:** " + data.reason)
				.setColor("#f04a41")
				.setFooter(footer(data.appealable ? "You are able to appeal this ban! Please join the support server and contact the dev" : "You are not able to appeal this ban"));

			return  interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (await isNotOwner(command, interaction, client, Uconfigs)) {
			return;
		};
		if (isNotDev(command, interaction, client, Uconfigs)) {
			return;
		};

		try {
			await command.init(client, interaction);
		} catch (error) {
			console.log(error)
			const replyOptions = { content: "Something went wrong" + "\n>>> " + error.message, ephemeral: false };
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
		configs = new userModel({ user: userId });
		await configs.save();
		configs = await userModel.findOne({ user: userId });
		return configs;
	}
	return configs;
}

async function isNotOwner(command, interaction, client) {
	if (!command.owner) return false;

	const guild = interaction.guild;
	if (!guild) {
		await interaction.reply({
			content: "Server not found",
			ephemeral: true,
		});
		return true;
	}

	const owner = await client.users.cache.get(guild.ownerId);
	if (!owner || interaction.user.id !== owner.id) {
		await interaction.reply({
			content: "you are not the server owner!",
			ephemeral: true,
		});
		return true;
	}

	return false;
}

function isNotDev(command, interaction, client, configs) {
	if (command.dev && !client.devs.includes(interaction.user.id)) {
		interaction.reply({
			content: "you are not a developer",
			ephemeral: true,
		});
		return true;
	}
	return false;
}
