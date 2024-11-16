import dotenv from 'dotenv';
import 'colors';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from './utils/Logger.js';
import t from "./utils/Translator.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    partials: [
        Partials.Channel,
        Partials.Message,
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
});

client.t = t;

async function loadModules() {
    const moduleFiles = fs.readdirSync(path.join(__dirname, 'modules'));

    for (const file of moduleFiles) {
        const modulePath = path.join(__dirname, 'modules', file);

        if (file.endsWith('.js') && !file.startsWith('_') && !['database.js'].includes(file)) {
            const module = await import(`file://${modulePath}`);
            await module.default(client);
        }
    }
}

async function start() {
    console.clear();
    Logger.info("Init", "Starting...");

    const startTime = Date.now();

    const databaseModule = await import(`file://${path.join(__dirname, 'modules', 'database.js')}`);
    await databaseModule.default();
    await loadModules();
    await client.login(process.env.BOT_TOKEN);

    const endTime = Date.now();
    Logger.info("Init", `Completed in ${(endTime - startTime) / 1000}s`.green);
}

start();

export default client;
