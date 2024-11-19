import { EmbedBuilder } from "discord.js";
import guildModel from "../../models/guild.js";

export default async (client, interaction, t) => {
    let fileName, model, field, value;
    model = [guildModel];
    value = interaction.user.id;
    fileName = "server-" + interaction.guild.id;

    async function downloadData(model, value) {
        const documents = await model.find({ guild: value }).exec();
        return { [model.modelName]: documents };
    }

    async function createAttachment(data, name) {
        const json = JSON.stringify(data, null, 2);
        const buffer = Buffer.from(json, 'utf-8');
        return new AttachmentBuilder(buffer, { name: name + '.json' });
    }

    if (interaction.guilld.ownerId !== interaction.user.id) {
        return interaction.reply({
            content: t(c.lang, "commands.download.server.notOwner"),
            ephemeral: true
        });
    }

    const data = await downloadData(model, value);
    const attachment = await createAttachment(data, fileName);
    const embed = new EmbedBuilder()
        .setTitle(t(c.lang, "commands.download.server.embed.title"))
        .setDescription(t(c.lang, "commands.download.server.embed.desc"))
        .setFooter(t(c.lang, "utils.footer"))
        .setColor(c.colour);
    try {
        await interaction.user.send({
            content: null,
            embeds: [embed],
            files: [attachment]
        });
        await interaction.editReply(t(c.lang, "commands.download.server.success"));
    } catch (error) {
        console.error(error);
        await interaction.editReply(t(c.lang, "commands.download.server.dmsClosed"));
    }
}