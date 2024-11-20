import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from '../utils/logger.js';

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

const ensureIdenticalStructure = (enData, langData) => {
    const result = {};

    for (const key in enData) {
        if (key === '__proto__' || key === 'constructor') continue;
        if (typeof enData[key] === 'object' && enData[key] !== null) {
            result[key] = ensureIdenticalStructure(enData[key], langData[key] || {});
        } else {
            result[key] = langData[key] !== undefined ? langData[key] : enData[key];
        }
    }

    return result;
};

const copyLangFiles = async () => {
    const langsDir = path.join(__dirname, '../assets/language');
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

        const updatedLangData = ensureIdenticalStructure(enData, langData);

        try {
            await fs.writeFile(filePath, JSON.stringify(updatedLangData, null, 2), 'utf8');
        } catch (error) {
            console.error(`Error writing to language file ${file}: ${error.message}`);
        }
    }));
};

const loadLanguageData = async () => {
    const langsDir = path.join(__dirname, '../assets/language');
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