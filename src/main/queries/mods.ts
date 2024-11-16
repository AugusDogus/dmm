import z from 'zod';
import { gameBananaApi } from '../gamebanana/api';
import { t } from '../trpc';

const DEADLOCK_GAME_ID = 20948;
const ITEMS_PER_PAGE = 15;

async function fetchDeadlockMods(page: number = 1) {
  try {
    const mods = await gameBananaApi.getModList(DEADLOCK_GAME_ID, page, ITEMS_PER_PAGE);
    return {
      items: mods._aRecords.map((mod) => ({
        name: mod._sName,
        author: mod._aSubmitter._sName,
        likes: mod._nLikeCount,
        downloads: mod._nViewCount,
        category: mod._aRootCategory._sName,
        previewImage: mod._aPreviewMedia._aImages[0]?._sBaseUrl + '/' + mod._aPreviewMedia._aImages[0]?._sFile530
      })),
      hasMore: mods._aRecords.length === ITEMS_PER_PAGE
    };
  } catch (error) {
    console.error('Failed to fetch mods:', error);
    return { items: [], hasMore: false };
  }
}

export const modsQuery = t.procedure.query(async () => {
  const { items } = await fetchDeadlockMods();
  return items;
});

export const categoriesQuery = t.procedure.query(async () => {
  const { items } = await fetchDeadlockMods();
  const categories = new Set(items.map(mod => mod.category));
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
    const cursor = input.cursor ?? 0;
    const page = Math.floor(cursor / ITEMS_PER_PAGE) + 1;
    
    const { items: allMods, hasMore } = await fetchDeadlockMods(page);
    
    let filteredMods = [...allMods];
    
    if (input.category) {
      filteredMods = filteredMods.filter(mod => mod.category === input.category);
    }
    
    switch (input.sort) {
      case 'likes':
        filteredMods.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'views':
        filteredMods.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      default: // newest
        filteredMods.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
    }

    return {
      items: filteredMods,
      nextCursor: hasMore ? cursor + ITEMS_PER_PAGE : undefined
    };
  }); 