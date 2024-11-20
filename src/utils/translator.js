import Logger from "./logger.js";
import loadLanguageData from "../modules/language.js";

const langCache = {};

(async function preloadLanguages() {
    try {
        const langs = await loadLanguageData();
        Object.assign(langCache, langs);
        Logger.info("Translator", "Language data preloaded successfully");
    } catch (error) {
        console.log(error);
        Logger.error("Translator", "Failed to preload language data", error);
    }
})();

function getValueFromLangData(langData, key) {
    const result = key.split('.').reduce((o, i) => (o ? o[i] : null), langData);
    return result !== null ? result.toString() : null;
}

export default function t(lang, key) {
    if (!langCache[lang]) {
        Logger.warn("Translator", `Language data for ${lang} not found`);
        return null;
    }

    return getValueFromLangData(langCache[lang], key);
}
