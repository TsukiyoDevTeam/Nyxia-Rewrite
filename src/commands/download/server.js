export default async (client, interaction, t) => {
    let fileName, model, field, value;
    model = [userModel];
    field = 'user';
    value = interaction.user.id;
    fileName = interaction.user.id;

    async function downloadData(model, field, value) {
        const documents = await model.find({ [field]: value }).exec();
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

    const data = await downloadData(model, field, value);
    const attachment = await createAttachment(data, fileName);

    try { 
        await interaction.user.send({
            content: 'Here is your data:',
            files: [attachment]
        });
        await interaction.editReply(t(c.lang, "commands.download.server.success"));
    } catch (error) {
        console.error(error);
        await interaction.editReply(t(c.lang, "commands.download.server.dmsClosed"));
    }
}