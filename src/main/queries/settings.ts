import settings from 'electron-settings/dist/settings';
import { getGamePath } from 'steam-game-path';
import { t } from '../trpc';

export const settingsQuery = t.procedure.query(async () => {
    const setupComplete = await settings.get('setupComplete');
    return {
        setupComplete,
        steamPath: getGamePath(1422450)?.game?.path,
    }
})

export const completeSetupMutation = t.procedure.mutation(async () => {
    await settings.set('setupComplete', true);
})

