import Discord from 'discord.js';
import user from '../../../models/user.js';

// c = client
// i = interaction
// d = config
export default async (c, i, d) => {
try {
    switch (i.values[0]) {
        case 'colour':
            const modal = new Discord.ModalBuilder()
            .setCustomId("config_model_colour")
            .setTitle("Page Indexer")
            .addComponents(
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId("colour")
                        .setLabel("Input your colour in hex!")
                        .setPlaceholder("e.g. #FF0000 or 0xFF0000 or FF0000")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setRequired(true)
                )
            );

        await i.showModal(modal);
        const modalSubmit = await i.awaitModalSubmit({ time: 300000 }).catch(() => null);
        if (!modalSubmit) return i.followUp({ content: "> You took too long to respond!", components: [], ephemeral: true });
        const input = modalSubmit.fields.getTextInputValue("colour");
        await modalSubmit.deferUpdate();
        let newColour = input;
        if (!newColour.startsWith("#")) {
            newColour = `#${input}`;
        }
        if (!/^#[0-9A-F]{6}$/i.test(newColour)) {
            return i.followUp({ content: "> Please provide a valid hex colour!", components: [], ephemeral: true });
        }
        if (newColour.startsWith("0x")) {
            newColour = newColour.replace("0x", "#");
        }
        try {
            await user.findOneAndUpdate({ user: i.user.id }, { config: {colour: newColour} });
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