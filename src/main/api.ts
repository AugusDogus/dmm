import { categoriesQuery, infiniteModsQuery, modsQuery } from './queries/mods';
import { setSteamPath } from './queries/setSteamPath';
import { completeSetupMutation, settingsQuery } from './queries/settings';
import { steamQuery } from './queries/steam';
import { t } from './trpc';

export const router = t.router({
  steam: steamQuery,
  setSteamPath: setSteamPath,
  mods: modsQuery,
  categories: categoriesQuery,
  infiniteMods: infiniteModsQuery,
  settings: settingsQuery,
  completeSetup: completeSetupMutation,
});

export type AppRouter = typeof router;

