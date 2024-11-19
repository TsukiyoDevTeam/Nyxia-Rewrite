import cron from "node-cron";
import Discord from "discord.js";
import fs from "fs/promises";

export default {
    name: "cron-botStats",
    once: true,

    async init(client) {
        try {
            const version = JSON.parse(await fs.readFile("./package.json")).version;
            const guilds = await client.guilds.fetch();
            let userCount = 0;
            let guildCount = 0;
            for (const guild of guilds.values()) {
                guildCount++;
                const guildData = await client.guilds.fetch(guild.id);
                userCount += guildData.memberCount;
            }
            const uptime = client.uptime;
            const ping = client.ws.ping;
            const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Memory usage in MB
            const commandCount = client.commands.size;
            const startTime = Date.now();
            await fetch("https://api.dreamwxve.dev");
            const endTime = Date.now();
            const apiLatency = endTime - startTime;
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
                    { name: "Ping", value: `\`\`\`fix\n${ping + "ms"}\`\`\``, inline: true },
                    { name: "Memory Usage", value: `\`\`\`fix\n${memoryUsage.toFixed(2)} MB\`\`\``, inline: true },
                    { name: "Commands", value: `\`\`\`fix\n${commandCount}\`\`\``, inline: true },
                    { name: "Dreamwxve API", value: `\`\`\`fix\n${apiLatency ? "Online | " +  apiLatency + "ms" : "Offline"}\`\`\``, inline: true },
                    { name: "Version", value: `\`\`\`fix\n${version}\`\`\``, inline: true }
                );

            const channel = await client.channels.fetch("1308370985250193420");
            await channel.send({ embeds: [embed] });

        cron.schedule('*/30 * * * *', async () => {
            const guildCount = await client.guilds.fetch();
            let userCount = 0;
            for (const guild of guilds.values()) {
                const members = await guild.fetch();
                userCount += members.size;
            }
            const uptime = client.uptime;
            const ping = client.ws.ping;
            const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Memory usage in MB
            const commandCount = client.commands.size;
            const startTime = Date.now();
            await fetch("https://api.dreamwxve.dev");
            const endTime = Date.now();
            const apiLatency = endTime - startTime;
            const refreshTime = Math.floor(Date.now() / 1000) + 1800; // 30 minutes

            console.log("Guild Count:", guildCount.size);
            console.log("User Count:", userCount);
            console.log("Uptime:", uptime);
            console.log("Ping:", ping);
            console.log("Memory Usage:", memoryUsage.toFixed(2), "MB");
            console.log("Command Count:", commandCount);
            console.log("API Latency:", apiLatency);
            console.log("Refresh Time:", refreshTime);

            const embed = new Discord.EmbedBuilder()
                .setTitle("📊 Bot Statistics")
                .setDescription(`> *Next refresh in:* <t:${refreshTime}:R>`)
                .setFooter({ text: "© Dreamwxve 2024" })
                .addFields(
                    { name: "Guilds", value: `\`\`\`\n${guildCount.length}\`\`\``, inline: true },
                    { name: "Users", value: `\`\`\`\n${userCount}\`\`\``, inline: true },
                    { name: "Uptime", value: `\`\`\`\n${uptime}\`\`\``, inline: true },
                    { name: "Ping", value: `\`\`\`\n${ping}\`\`\``, inline: true },
                    { name: "Memory Usage", value: `\`\`\`\n${memoryUsage.toFixed(2)} MB\`\`\``, inline: true },
                    { name: "Commands", value: `\`\`\`\n${commandCount}\`\`\``, inline: true },
                    { name: "API Latency", value: `\`\`\`\n${apiLatency}\`\`\``, inline: true }
                );

            const channel = await client.channels.fetch("1308370985250193420");
            await channel.send({ embeds: [embed] });
        });

    } catch (e) {
        console.error(e);
    }
} 
};
