import Discord from 'discord.js';
import Translator from "../utils/Translator.js";

export default async (client) => {

    client.getUserData = async function (user) {
        const data = await model.findOne({user: user });
        if (!data || !data.config) {
            const x = new model({
                user: user
            }).save();
            return x.config;
        }
        return data.config;
    }

    client.t = Translator;
}