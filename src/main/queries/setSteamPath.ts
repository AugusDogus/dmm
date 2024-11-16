import settings from 'electron-settings/dist/settings';
import z from 'zod';
import { t } from '../trpc';

export const setSteamPath = t.procedure.input(z.object({ path: z.string() })).mutation(async ({input}) => {

    return settings.set('steamPath', input.path);

})