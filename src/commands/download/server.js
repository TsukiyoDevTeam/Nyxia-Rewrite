import { EmbedBuilder, AttachmentBuilder } from "discord.js";
import guildModel from "../../models/guild.js";

export default async (client, interaction, t, c) => {
    let fileName, model, field, value;
    model = [guildModel];
    value = interaction.user.id;
    fileName = "server-" + interaction.guild.id;

    async function downloadData(models, value) {
        const data = {};
        for (const model of models) {
            const documents = await model.find({ user: value }).exec();
            data[model.modelName] = documents;
        }
        return data;
    }

    async function createAttachment(data, name) {
        const json = JSON.stringify(data, null, 2);
        const buffer = Buffer.from(json, 'utf-8');
        return new AttachmentBuilder(buffer, { name: name + '.json' });
    }

    if (interaction.guild.ownerId !== interaction.user.id) {
        return interaction.reply({
            content: t(c.lang, "commands.download.server.notOwner"),
            ephemeral: true
        });
    }

    await interaction.deferReply({fetchReply: true});
    await interaction.editReply(t(c.lang, "commands.download.server.processing"));

    const data = await downloadData(model, value);
    const attachment = await createAttachment(data, fileName);
    const embed = new EmbedBuilder()
        .setTitle(t(c.lang, "commands.download.server.embed.title"))
        .setDescription(t(c.lang, "commands.download.server.embed.desc"))
        .setFooter({text: t(c.lang, "utils.footer")})
        .setColor(c.colour);
        try {
            await interaction.user.send({
                content: null,
                embeds: [embed],
                files: [attachment]
            });
        } catch (error) {
            await interaction.editReply(t(c.lang, "commands.download.server.dmsClosed"));
            return;
        }
        await interaction.editReply(t(c.lang, "commands.download.server.success"));
}