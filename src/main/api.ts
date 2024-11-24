import { launchQuery } from './queries/launch';
import { categoriesQuery, infiniteModsQuery, openModsFolderMutation } from './queries/mods';
import { patchQuery, watchPatchStatusQuery } from './queries/patch';
import { setSteamPath } from './queries/setSteamPath';
import { completeSetupMutation, settingsQuery } from './queries/settings';
import { steamQuery } from './queries/steam';
import { t } from './trpc';

export const router = t.router({
  steam: steamQuery,
  setSteamPath: setSteamPath,
  categories: categoriesQuery,
  infiniteMods: infiniteModsQuery,
  settings: settingsQuery,
  completeSetup: completeSetupMutation,
  patch: patchQuery,
  watchPatchStatus: watchPatchStatusQuery,
  launch: launchQuery,
  openModsFolder: openModsFolderMutation
});

export type AppRouter = typeof router;

