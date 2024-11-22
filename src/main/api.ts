import { launchQuery } from './queries/launch';
import { categoriesQuery, infiniteModsQuery, modsQuery, openModsFolderMutation } from './queries/mods';
import { isPatchedQuery, patchQuery } from './queries/patch';
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
  patch: patchQuery,
  isPatched: isPatchedQuery,
  launch: launchQuery,
  openModsFolder: openModsFolderMutation
});

export type AppRouter = typeof router;

