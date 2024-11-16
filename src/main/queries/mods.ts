import z from 'zod';
import { t } from '../trpc';
import { gameBananaApi } from '../gamebanana/api';

async function fetchDeadlockMods() {
  try {
    const DEADLOCK_GAME_ID = 20948;
    const mods = await gameBananaApi.getModList(DEADLOCK_GAME_ID);

    return mods._aRecords.map((mod) => {
      const previewImage = mod._aPreviewMedia._aImages[0]?._sBaseUrl + '/' + mod._aPreviewMedia._aImages[0]?._sFile530;
      return {
        name: mod._sName,
        author: mod._aSubmitter._sName,
        likes: mod._nLikeCount,
        downloads: mod._nViewCount,
        category: mod._aRootCategory._sName,
        previewImage
      };
    });
  } catch (error) {
    console.error('Failed to fetch mods:', error);
    return [];
  }
}

export const modsQuery = t.procedure.query(async () => {
  return await fetchDeadlockMods();
});

export const categoriesQuery = t.procedure.query(async () => {
  const mods = await fetchDeadlockMods();
  const categories = new Set(mods.map(mod => mod.category));
  return Array.from(categories);
});

export const infiniteModsQuery = t.procedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.number().optional(),
      sort: z.enum(['newest', 'likes', 'views']).optional(),
      category: z.string().optional(),
    }),
  )
  .query(async ({ input }) => {
    const { limit, cursor, sort, category } = input;
    
    let query = await fetchDeadlockMods();
    
    if (category) {
      query = query.filter(mod => mod.category === category);
    }
    
    switch (sort) {
      case 'likes':
        query = query.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'views':
        query = query.sort((a, b) => b.downloads - a.downloads);
        break;
      default: // newest
        query = query.sort((a, b) => b.downloads - a.downloads);
        break;
    }
    
    const items = query.slice(
      cursor || 0,
      (cursor || 0) + (limit ?? 10)
    );
    let nextCursor: typeof cursor = undefined;
    if (items.length === (limit ?? 10)) {
      nextCursor = cursor ? cursor + (limit ?? 10) : (limit ?? 10);
    }

    return {
      items,
      nextCursor,
    };
  }); 