import settings from 'electron-settings';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { t } from '../trpc';

const SEARCH_PATHS = {
    MARKER: 'SearchPaths',
    MOD_LINE: 'Mod citadel',
    WRITE_LINE: 'Write citadel',
    ADDONS_LINE: 'Game citadel/addons',
    GAME_LINE: 'Game citadel',
    CORE_LINE: 'Game core'
} as const;

const FILE_PATH = {
    RELATIVE: 'game/citadel/gameinfo.gi'
} as const;

const createNewSearchPaths = () => `${SEARCH_PATHS.MARKER}
        {
            ${SEARCH_PATHS.MOD_LINE}
            ${SEARCH_PATHS.WRITE_LINE}
            ${SEARCH_PATHS.ADDONS_LINE}
            ${SEARCH_PATHS.GAME_LINE}
            ${SEARCH_PATHS.CORE_LINE}
        }`;

const isAlreadyPatched = (content: string) => {
    const modLine = content.includes(SEARCH_PATHS.MOD_LINE);
    const writeLine = content.includes(SEARCH_PATHS.WRITE_LINE);
    const addonsLine = content.includes(SEARCH_PATHS.ADDONS_LINE);
    return modLine && writeLine && addonsLine;
};

const replaceSearchPaths = (content: string) => {
    const startIndex = content.indexOf(SEARCH_PATHS.MARKER);
    const searchPathsStart = content.indexOf('{', startIndex);
    const searchPathsEnd = content.indexOf('}', searchPathsStart) + 1;
    
    return content.slice(0, startIndex) + 
           createNewSearchPaths() + 
           content.slice(searchPathsEnd);
};

export const patchQuery = t.procedure.mutation(async () => {
    const path = await settings.get('steamPath') as string;
    const filePath = join(path, FILE_PATH.RELATIVE);

    try {
        const content = await readFile(filePath, 'utf-8');
        
        if (isAlreadyPatched(content)) {
            return { success: true, alreadyPatched: true };
        }

        const newContent = replaceSearchPaths(content);
        await writeFile(filePath, newContent, 'utf-8');
        
        return { success: true, alreadyPatched: false };
    } catch (error) {
        console.error('Error modifying file:', error);
        throw error;
    }
});
