import { Riffy } from "riffy";
import nodes from "../utils/nodes.js";

export default async (client) => {
const p = new Riffy(client, nodes, {
    send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild) guild.shard.send(payload);
    },
    defaultSearchPlatform: "ytmsearch",
    restVersion: "v4",
});

client.player = p;
client.musicPanel = new Map();
client.musicSession = new Map();
client.queue = new Map();
}