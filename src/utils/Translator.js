import Logger from "../utils/Logger.js";
import loadLanguageData from "../modules/language.js";

class Translator {
    constructor() {
        this.langCache = {};
    }

    t(lang, key, reload = false) {
        Logger.debug("Translator", `t() called with lang: ${lang}, key: ${key}, reload: ${reload}`);

        if (!reload && Object.keys(this.langCache).length) {
            Logger.debug("Translator", `langCache exists with keys: ${Object.keys(this.langCache)}`);
            if (this.langCache[lang]) {
                Logger.debug("Translator", `Found language data in cache for lang: ${lang}`);
                return this.getValueFromLangData(this.langCache[lang], key).toString();
            }
            Logger.debug("Translator", `No language data found in cache for lang: ${lang}`);
            return null;
        }

        if (reload || !Object.keys(this.langCache).length) {
            Logger.debug("Translator", `Reloading language data`);
            const langData = this.reloadLangs();
            Object.assign(this.langCache, langData);
        }

        return this.getValueFromLangData(this.langCache[lang], key);
    }

    reloadLangs() {
        try {
            Logger.debug("Translator", `reloadLangs() called`);
            const langs = loadLanguageData();
            Logger.debug("Translator", `Language data loaded: ${Object.keys(langs)}`);
            return langs;
        } catch (error) {
            console.log(error);
            Logger.error("Translator", `Failed to reload language data`, error);
            return {};
        }
    }

    getValueFromLangData(langData, key) {
        Logger.debug("Translator", `getValueFromLangData() called with key: ${key}`);
        const value = key.split('.').reduce((o, i) => (o ? o[i] : null), langData);
        Logger.debug("Translator", `Value retrieved: ${value}`);
        return value;
    }
}

export default Translator;