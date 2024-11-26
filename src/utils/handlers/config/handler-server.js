import Discord from 'discord.js';
import guild from '../../../models/guild.js';

// c = client
// i = interaction
// d = config
export default async (c, i, d) => {
try {
    switch (i.values[0]) {
        case 'main_chat':
            const modal = new Discord.ModalBuilder()
            .setCustomId("config_model_colour")
            .setTitle("Page Indexer")
            .addComponents(
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId("main_channel")
                        .setLabel("Input the channel ID")
                        .setPlaceholder("Settings > Advanced > Developer Mode")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setRequired(true)
                )
            );

        await i.showModal(modal);
        const modalSubmit = await i.awaitModalSubmit({ time: 300000 }).catch(() => null);
        if (!modalSubmit) return i.followUp({ content: "> You took too long to respond!", components: [], ephemeral: true });
        const input = modalSubmit.fields.getTextInputValue("main_channel");
        await modalSubmit.deferUpdate();
        const isValid = await i.guild.channels.fetch(input).catch(() => null);
        if (!isValid) return i.followUp({ content: "> The channel ID you provided is invalid!", components: [], ephemeral: true });
        try {
            await guild.findOneAndUpdate({ guild: i.guild.id }, { config: { general: { main_chat: input } }});
        } catch (e) {
           await i.followUp({ content: "> An error occurred while updating your colour!", components: [], ephemeral: true });
        }
            break;




        // this shouldnt trigger ever
        default:
            return Promise.reject();
    }
} catch (e) {
    console.error(e);
    i.followUp({ content: "An error occurred while processing your request!", components: [], ephemeral: true });
    return;
}
}