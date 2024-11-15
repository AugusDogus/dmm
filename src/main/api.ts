import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';
import { getGamePath } from 'steam-game-path';
import superjson from 'superjson';
import z from 'zod';
import { gameBananaApi } from './gamebanana/api';

const ee = new EventEmitter();

const t = initTRPC.create({ isServer: true, transformer: superjson });

export const router = t.router({
  greeting: t.procedure.input(z.object({ name: z.string() })).query((req) => {
    const { input } = req;

    ee.emit('greeting', `Greeted ${input.name}`);
    return {
      text: `Hello ${input.name}` as const,
    };
  }),
  subscription: t.procedure.subscription(() => {
    return observable((emit) => {
      function onGreet(text: string) {
        emit.next({ text });
      }

      ee.on('greeting', onGreet);

      return () => {
        ee.off('greeting', onGreet);
      };
    });
  }),
  steam: t.procedure.query(() => {
    const paths = getGamePath(1422450);
    return {
      paths
    };
  }),
  mods: t.procedure.query(async () => {
    return await fetchDeadlockMods();
  }),
  categories: t.procedure.query(async () => {
    const mods = await fetchDeadlockMods();
    const categories = new Set(mods.map(mod => mod.category));
    return Array.from(categories);
  }),
  infiniteMods: t.procedure.input(
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
    
    // Apply category filter
    if (category) {
      query = query.filter(mod => mod.category === category);
    }
    
    // Apply sorting
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
    
    // Apply pagination
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
  })
});

export type AppRouter = typeof router;

async function fetchDeadlockMods() {
  try {
    const DEADLOCK_GAME_ID = 20948
    const mods = await gameBananaApi.getModList(DEADLOCK_GAME_ID)

    return mods._aRecords.map((mod) => {
      const previewImage = mod._aPreviewMedia._aImages[0]?._sBaseUrl + '/' + mod._aPreviewMedia._aImages[0]?._sFile530;
      return {
        name: mod._sName,
        author: mod._aSubmitter._sName,
        likes: mod._nLikeCount,
        downloads: mod._nViewCount,
        category: mod._aRootCategory._sName,
        previewImage
      }
    })

  } catch (error) {
    console.error('Failed to fetch mods:', error)
    return [];
  }
}

