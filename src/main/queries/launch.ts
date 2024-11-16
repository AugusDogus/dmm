import { shell } from 'electron';
import { t } from '../trpc';

export const launchQuery = t.procedure.mutation(async () => {
    shell.openExternal('steam://rungameid/1422450');
});