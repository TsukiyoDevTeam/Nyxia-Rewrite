const Discord = require('discord.js');

export default {
	name: "musicHandler",
	once: false,

	async init(client, message) {
    client.on(Discord.Events.InteractionCreate, async (interaction) => {
        try {
        if (
            !interaction.isButton() ||
            !interaction.customId.startsWith("Bot-music") ||
            !interaction.customId
        ) return;

        const player = client.player.players.get(interaction.guild.id);
        if (!player) return interaction.reply({
            content: "Nothing is playing right now",
            ephemeral: true
        });

        // check if the button press was from 
        // the current panel message
        const data = client.musicPanel.get(player.guildId);
        if ((!data || interaction.message.id !== data.id) && !interaction.customId.includes("queue"))
            return client.errNormal({
            error: "This is an out of date music panel so it does not work anymore",
            type: "ephemeral"
        }, interaction);

        // check if the button press was from the music initiator
        let action;
        let cmdId = interaction.customId;
        const cmdname = cmdId.replace("Bot-music", "")
        switch (cmdname) {
            case "play":
                action = "resume playing the song";

            case "pause":
                action = "pause the music";

            case "stop":
                action = "stop the music"

            case "next":
                action = "go to the next song"

            case "prev":
            case "previous":
                action = "go back a song"

            default:
                action = "do what you wanted to do here"
        }
        
        if (player.current.info.requester.id !== interaction.user.id && !interaction.customId.includes("queue")) return client.errNormal({
            error: `This panel is controlled by ${player.current.info.requester}. Please ask them to ${action}.`,
            type: "ephemeral"
        }, interaction);


        // continue processing
        if (interaction.customId === "Bot-musicpause") {
            try {
                await player.pause(true);
            } catch {
                return interaction.reply({
                    content: "Huh, seems like this didn't work",
                    ephemeral: true
                });
            }
            await interaction.deferUpdate();
        }

        if (interaction.customId === "Bot-musicstart") {
            try {
                await player.pause(false);
            } catch {
                return interaction.reply({
                    content: "Huh, seems like this didn't work",
                    ephemeral: true
                });
            }
            await interaction.deferUpdate();
        }

        if (interaction.customId === "Bot-musicstop") {
            try {
                await player.destroy();
            } catch {
                return interaction.reply({
                    content: "Huh, seems like this didn't work",
                    ephemeral: true
                });
            }
            client.embed({
                desc: `Music has been stopped by ${interaction.user}`,
                color: `#ED4245`,
                components: [],
                type: 'edit'
            }, interaction.message);

        }

        if (interaction.customId === "Bot-musicnext") {
            try {
            await player.stop();
        } catch {
            return interaction.reply({
                content: "Huh, seems like this didn't work",
                ephemeral: true
            });
        }
        await interaction.deferUpdate();
            // You can embed the new track details here if needed
        }

        if (interaction.customId === "Bot-musicprev") {
            if (!player.queue.previous) return;
            try {
            await player.play(player.queue.previous);
            } catch { 
                return interaction.reply({
                    content: "Huh, seems like this didn't work",
                    ephemeral: true
                });
            }
            await interaction.deferUpdate();
            // You can embed the previous track details here if needed
        }

        if (interaction.customId === "Bot-musicqueue") {
            try {
                const player = client.player.players.get(interaction.guild.id);

                const channel = interaction.member.voice.channel;
                if (!channel) return client.errNormal({
                    error: `You're not in a voice channel!`,
                    type: 'ephemeral'
                }, interaction);
            
                if (player && (channel.id !== player?.voiceChannel)) return client.errNormal({
                    error: `You are not in the same voice channel! Please come listen with me in <#${player.voiceChannel}>!`,
                    type: 'ephemeral'
                }, interaction);
            
                if (!player || !player.current) return client.errNormal({
                    error: "There are no songs playing in this server",
                    type: 'ephemeral'
                }, interaction);
            
                let count = 0;
                let status;
                const requester = client.users.cache.get(player.current.info.requester);
            
                if (player.queue.length == 0) {
                    status = "No songs in the queue to play after";
                }
                else {
                    status = player.queue.map((track) => {
                        count += 1;
                        return (`**${count}** -> [${track.info.title.length >= 45 ? `${track.info.title.slice(0, 43)}...` : track.info.title}](${track.info.uri})\n- ${requester}`);
                    }).join("\n");
                }
            
                client.embed({
                    title: `Music Queue`,
                    desc: status,
                    thumbnail: interaction.guild.iconURL({ size: 4096 }),
                    type: 'ephemeral'
                }, interaction) 

            } catch {
                return interaction.reply({
                    content: "Huh, seems like this didn't work",
                    ephemeral: true
                });
            }
        }

        if (interaction.customId === "Bot-musicvolume") {
            const volumeModal = new Discord.ModalBuilder()
                .setCustomId('music-volume')
                .setTitle('Volume Adjustment')
                .setComponents(
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            // volume input
                            new Discord.TextInputBuilder()
                                .setCustomId('volume')
                                .setLabel('New volume to set to')
                                .setStyle(Discord.TextInputStyle.Short)
                                .setRequired(true)
                                .setPlaceholder('Numbers only!')
                                .setMinLength(1)
                                .setMaxLength(4)
                        )
                )
                // show the modal
                try {
                await interaction.showModal(volumeModal);
                } catch (e) {console.log(e)}
        }

    } catch (e) {
        console.log(e)
        client.errNormal({
            error: "Something bad happened when processing this action",
            type: "ephemeral"
        }, interaction);
    }
}
}
}
