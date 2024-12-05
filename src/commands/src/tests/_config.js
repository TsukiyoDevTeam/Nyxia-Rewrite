import { ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } from "discord.js";
import { footer } from "../../../utils/functions.js";
import path from "node:path";
import { fileURLToPath } from 'node:url';

export default async (client, interaction, config, Sconfig) => {
    async function handle(client, interaction, config, type, btnInt, Sconfig) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const y = path.resolve(__dirname, "../../../utils/handlers/config", `${type}.js`);
        const x = await import("file://" + y);
        return x.default(client, interaction, config, btnInt, Sconfig);
    }

    const mainEmbed = new EmbedBuilder()
        .setTitle("⚙️ Configuration")
        .setFooter(footer())
        .setDescription(">>> Welcome to the main configuration panel! Choose below what you would like to configure!\n\n> **User** - Configure your user settings\n> **Server** - Configure your server settings")
        .setColor(config.colour);

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("config:user")
                .setLabel("User")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("config:server")
                .setLabel("Server")
                .setStyle(ButtonStyle.Secondary),
        );

    const x = await interaction.reply({ embeds: [mainEmbed], components: [row] });

    const btnCollector = await x.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });

    btnCollector.on('collect', async i => {
        if (i.user.id !== interaction.user.id) {
            btnCollector.resetTimer();
            return i.reply({ content: "> This is not yours", ephemeral: true });
        }

        if (i.customId.startsWith('config:')) {
            const type = i.customId.split(':')[1];
            if (type === 'server' && i.user.id !== interaction.guild.ownerId) {
                btnCollector.resetTimer();
                return i.reply({ content: "You need to be the server owner to configure the server!", ephemeral: true });
            }
            return handle(client, interaction, config, type, i, Sconfig);
        }
    });
};
