import { categoriesQuery, infiniteModsQuery, modsQuery } from './queries/mods';
import { steamQuery } from './queries/steam';
import { t } from './trpc';

export const router = t.router({
  steam: steamQuery,
  mods: modsQuery,
  categories: categoriesQuery,
  infiniteMods: infiniteModsQuery,
});

export type AppRouter = typeof router;

