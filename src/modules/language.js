import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from '../utils/Logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cleanAndParseJSON = async (filePath) => {
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const parsedData = JSON.parse(fileContent);
        return JSON.parse(JSON.stringify(parsedData));
    } catch (error) {
        throw new Error(`Error reading or parsing JSON file ${filePath}: ${error.message}`);
    }
};

const addMissingKeys = (enData, langData) => {
    for (const key in enData) {
        if (key === '__proto__' || key === 'constructor') continue;
        if (key.startsWith('_')) {
            langData[key] = enData[key];
        } else if (typeof enData[key] === 'object' && enData[key] !== null) {
            if (!(key in langData) || langData[key] === null) {
                langData[key] = {};
            }
            addMissingKeys(enData[key], langData[key]);
        } else {
            if (!(key in langData) || langData[key] === null) {
                langData[key] = enData[key];
            }
        }
    }
};

const copyLangFiles = async () => {
    const langsDir = path.join(__dirname, '../utils/language');
    const enFile = path.join(langsDir, 'english.json');

    let enData;
    try {
        enData = await cleanAndParseJSON(enFile);
    } catch (error) {
        throw new Error("Failed to read en language file: " + error.message);
    }

    const langFiles = (await fs.readdir(langsDir)).filter(file => file.endsWith('.json') && file !== 'english.json');

    await Promise.all(langFiles.map(async file => {
        const filePath = path.join(langsDir, file);
        let langData;
        try {
            langData = await cleanAndParseJSON(filePath);
        } catch (error) {
            console.error(`Error reading language file ${file}: ${error.message}`);
            return;
        }

        addMissingKeys(enData, langData);

        for (const key in langData) {
            if (!(key in enData) && !key.startsWith('_')) {
                delete langData[key];
            }
        }

        const orderedLangData = {};
        for (const key in enData) {
            if (key in langData) {
                orderedLangData[key] = langData[key];
            }
        }
        for (const key in langData) {
            if (!(key in orderedLangData)) {
                orderedLangData[key] = langData[key];
            }
        }

        for (const key in enData) {
            if (key.startsWith('_')) {
                orderedLangData[key] = enData[key];
            }
        }

        try {
            await fs.writeFile(filePath, JSON.stringify(orderedLangData, null, 2), 'utf8');
        } catch (error) {
            console.error(`Error writing to language file ${file}: ${error.message}`);
        }
    }));
};

const loadLanguageData = async () => {
    const langsDir = path.join(__dirname, '../utils/language');
    const enFile = path.join(langsDir, 'english.json');

    try {
        await fs.access(enFile);
    } catch {
        throw new Error("Language file does not exist");
    }

    await copyLangFiles();

    const langFiles = (await fs.readdir(langsDir)).filter(file => file.endsWith('.json'));

    const langCollection = {};

    await Promise.all(langFiles.map(async file => {       
        const filePath = path.join(langsDir, file);
        const langName = path.basename(file, '.json');
        try {
            const langData = await cleanAndParseJSON(filePath);
            langCollection[langName] = langData;
        } catch (error) {
            Logger.error("Language.js", `Failed to load language data for ${langName}`, error);
        }
    }));

    return Object.freeze(langCollection);
};

export default loadLanguageData;