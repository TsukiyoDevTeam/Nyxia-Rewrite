import Logger from "../utils/Logger.js";
import loadLanguageData from "../modules/language.js";

const langCache = {};

export default async function t(langValue, key, reload = false) {

    if (!reload && Object.keys(langCache).length) {
        return getValueFromLangData(langCache[lang], key);
    }

    if (reload || !Object.keys(langCache).length) {
        const langData = await reloadLangs();
        Object.assign(langCache, langData);
    }

    return getValueFromLangData(langCache[lang], key);
}

async function reloadLangs() {
    try {
        const langs = await loadLanguageData();
        return langs;
    } catch (error) {
        console.log(error);
        Logger.error("Translator", `Failed to reload language data`, error);
        return {};
    }
}

function getValueFromLangData(langData, key) {
    return key.split('.').reduce((o, i) => (o ? o[i] : null), langData);
}