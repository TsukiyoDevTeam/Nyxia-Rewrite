import Logger from "../utils/Logger.js";
import loadLanguageData from "../modules/language.js";

const langCache = {};

(async function preloadLanguages() {
    try {
        const langs = await loadLanguageData();
        Object.assign(langCache, langs);
    } catch (error) {
        console.log(error);
        Logger.error("Translator", "Failed to preload language data", error);
    }
})();

export default function t(lang, key) {
    if (!langCache[lang]) {
        Logger.error("Translator", `Language data for ${lang} not found`);
        return null;
    }

    return getValueFromLangData(langCache[lang], key);
}

function getValueFromLangData(langData, key) {
    return key.split('.').reduce((o, i) => (o ? o[i] : null), langData);
}
