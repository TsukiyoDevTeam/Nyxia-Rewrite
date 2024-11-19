import { EmbedBuilder } from "discord.js";
import userModel from "../../models/user.js";

export default async (client, interaction, t) => {
    let fileName, models, value;
    models = [
        userModel,
        //confessionsModel,
    ];
    value = interaction.user.id;
    fileName = "user-" + interaction.user.id;

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

    const data = await downloadData(models, value);
    const attachment = await createAttachment(data, fileName);
    const embed = new EmbedBuilder()
        .setTitle(t(c.lang, "commands.download.user.embed.title"))
        .setDescription(t(c.lang, "commands.download.user.embed.desc"))
        .setFooter(t(c.lang, "utils.footer"))
        .setColor(c.colour);
    try {
        await interaction.user.send({
            content: null,
            embeds: [embed],
            files: [attachment]
        });
        await interaction.editReply(t(c.lang, "commands.download.user.success"));
    } catch (error) {
        console.error(error);
        await interaction.editReply(t(c.lang, "commands.download.user.dmsClosed"));
    }
}