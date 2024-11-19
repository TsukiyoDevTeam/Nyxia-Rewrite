import Discord from "discord.js";
import fs from "fs/promises";

export default {
    name: "cron-botStats",
    once: false,

    async init(client) {
        try {
            const version = JSON.parse(await fs.readFile("./package.json")).version;
            const guilds = await client.guilds.fetch();
            let userCount = 0;
            let guildCount = 0;

            for (const guild of guilds.values()) {
                try {
                    guildCount++;
                    const guildData = await client.guilds.fetch(guild.id);
                    userCount += guildData.memberCount;
                } catch (guildError) {
                    console.error(`Failed to fetch data for guild ${guild.id}:`, guildError);
                }
            }

            const uptime = client.uptime;
            const ping = client.ws.ping;
            const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Memory usage in MB
            const commandCount = client.commands.size;
            const startTime = Date.now();

            let apiLatency;
            try {
                const res = await fetch("https://api.dreamwxve.dev", {
                    method: "GET"
                });
                apiLatency = Date.now() - startTime;
                if (!res.ok) {
                    apiLatency = null;
                }

            } catch (apiError) {
                console.error("Failed to fetch Dreamwxve API:", apiError);
                apiLatency = null;
            }

            const refreshTime = Math.floor(Date.now() / 1000) + 1800; // 30 minutes

            const embed = new Discord.EmbedBuilder()
                .setTitle("📊 Bot Statistics")
                .setDescription(`> *Next refresh in:* <t:${refreshTime}:R>`)
                .setFooter({ text: "© Dreamwxve 2024" })
                .setColor("DarkButNotBlack")
                .addFields(
                    { name: "Guilds", value: `\`\`\`fix\n${guildCount}\`\`\``, inline: true },
                    { name: "Users", value: `\`\`\`fix\n${userCount}\`\`\``, inline: true },
                    { name: "Uptime", value: `\`\`\`fix\n${Math.floor(uptime / 1000)}s\`\`\``, inline: true },
                    { name: "Ping", value: `\`\`\`fix\n${ping}ms\`\`\``, inline: true },
                    { name: "Memory Usage", value: `\`\`\`fix\n${memoryUsage.toFixed(2)} MB\`\`\``, inline: true },
                    { name: "Commands", value: `\`\`\`fix\n${commandCount}\`\`\``, inline: true },
                    { name: "Dreamwxve API", value: `\`\`\`fix\n${apiLatency !== null ? "Online | " + apiLatency + "ms" : "Offline"}\`\`\``, inline: true },
                    { name: "Version", value: `\`\`\`fix\n${version}\`\`\``, inline: true }
                );

            const channel = await client.channels.fetch("1308370985250193420");
            const statMsg = await channel.send({ embeds: [embed] });

            setInterval(async () => {
                try {
                    await statMsg.edit({ embeds: [embed] });
                } catch (editError) {
                    console.error("Failed to edit stats message:", editError);
                }
            }, 1800000);

        } catch (e) {
            console.error("Failed to initialize bot stats:", e);
        }
    }
};