import fs from 'fs';
import { AttachmentBuilder } from 'discord.js';

export default async (client, interaction, t, c) => {
    const commandsArray = Array.from(client.commands.values());
    const jsonObject = JSON.stringify(commandsArray, null, 2);
    const buffer = Buffer.from(jsonObject, 'utf-8');

    const file = new AttachmentBuilder(buffer, { name: 'commands.json' });
    await interaction.reply({ files: [file] });
}
